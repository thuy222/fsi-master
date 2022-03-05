import path from 'path'
import assert from 'assert'
import { authenticator } from 'otplib'
import status from 'http-status'

import { settings, logger } from '@fsi/core'
import { settings as coreSettings } from '@fusang/core'
import { CLIENT_DIR_PATH } from '../../constants/setting'
import { EMAIL_REGEX } from '../../constants/regex'
import { oidcProvider } from '../../utils/oidcProvider'
import Session from '../../utils/session'
import Account from '../../utils/account'
import decodeToken from '../../utils/decodeToken'
import { CognitoIdentityServiceProvider } from '../../utils/awsUtils'
import { verifyPassword, updateRecentPasswords } from '../../utils/auth'
import BadRequestError, { PasswordExpiredError } from '../../errors/badRequestError'
import { ERROR_CODE, ERROR_MESSAGE } from '../../constants/error'
import { getCookie } from '../../utils/getCookie'

const USER_STATUS = {
  NOT_LOGIN: 'NOT_LOGIN'
}
const REFERRAL_COOKIE_NAME = coreSettings.referral.referralIdentifierCookie.name.toLowerCase()
const initLoginPage = async (req, res, next) => {
  try {
    const { uid, prompt } = await oidcProvider.interactionDetails(req, res)
    Session.add(uid)
    switch (prompt.name) {
      case 'login': {
        return res.sendFile(path.join(CLIENT_DIR_PATH, 'index.html'))
      }
      case 'consent': {
        const consent = {}

        // any scopes you do not wish to grant go in here
        //   otherwise details.scopes.new.concat(details.scopes.accepted) will be granted
        consent.rejectedScopes = []

        // any claims you do not wish to grant go in here
        //   otherwise all claims mapped to granted scopes
        //   and details.claims.new.concat(details.claims.accepted) will be granted
        consent.rejectedClaims = []

        // replace = false means previously rejected scopes and claims remain rejected
        // changing this to true will remove those rejections in favour of just what you rejected above
        consent.replace = false
        const result = {
          consent
        }
        await oidcProvider.interactionFinished(req, res, result, {
          mergeWithLastSubmission: true
        })
        break
      }
      default:
        return undefined
    }
  } catch (err) {
    if (err.name === 'SessionNotFound') {
      return res.redirect('/')
    }
    logger.error(err, '/ - error: ')
    next(err)
  }
}

const getUserById = async (userId) => {
  const resp = await fetch(`${settings.api.uamBaseUrl}/users/${userId}`, {
    method: 'GET',
    headers: { 'app-secret-key': settings.api.uamSecretKey }
  })
  return resp.json()
}

const login = async (req, res, next) => {
  try {
    const {
      uid,
      prompt: { name }
    } = await oidcProvider.interactionDetails(req, res)
    logger.info('Start login')
    assert.strictEqual(name, 'login')
    const altEmail = req.body.login
    const primaryUser = await Account.findByLogin(altEmail)
    const userInfo = await getUserById(primaryUser.userId)

    console.log('RESEND:primaryEmail', primaryUser, userInfo)
    const { email: primaryEmail, username, isVerifiedEmail: isPrimaryEmailVerified, isCurrentUserVerifiedEmail } = primaryUser
    const loginByPrimaryEmail = altEmail === primaryEmail
    const loginByUsername = !(EMAIL_REGEX.test(altEmail))
    let authenticationResult
    let cognitoUser = {}

    try {
      cognitoUser = await CognitoIdentityServiceProvider.adminGetUser({
        UserPoolId: settings.cognito.userPoolId,
        Username: primaryEmail
      }).promise()

      authenticationResult = await CognitoIdentityServiceProvider.adminInitiateAuth({
        ClientId: settings.cognito.userPoolClientId,
        UserPoolId: settings.cognito.userPoolId,
        AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
        AuthParameters: {
          USERNAME: primaryEmail,
          PASSWORD: req.body.password
        }
      }).promise()
      console.log('authenticationResult', authenticationResult)
    } catch (e) {
      // Catch error of cognito

      if (e.message.startsWith('Temporary password has expired')) { // 'Temporary password has expired and must be reset by an administrator.'
        const resp = await fetch(`${settings.api.uamBaseUrl}/user/temporary-password/${primaryUser.userId}`, {
          method: 'GET',
          headers: { 'app-secret-key': settings.api.uamSecretKey }
        })
        console.log('RESP 2', await resp.json())
        throw new PasswordExpiredError(ERROR_MESSAGE.TEMPORARY_PASSWORD_EXPIRED)
      }

      // To check if user login with old temporary password
      if (e.code === 'NotAuthorizedException' && cognitoUser.UserStatus === 'FORCE_CHANGE_PASSWORD') {
        throw new PasswordExpiredError(ERROR_MESSAGE.OLD_TEMPORARY_PASSWORD_INVALID)
      }

      // Do not handle error when user is not confirm
      if (e.name !== 'UserNotConfirmedException') {
        throw e
      }
    }

    if (loginByPrimaryEmail || loginByUsername) {
      // Handle case login by primary email or username
      if (!isPrimaryEmailVerified) {
        await fetch(`${settings.api.uamBaseUrl}/email/resend-verification/${primaryEmail}`, {
          method: 'GET'
        }).then(async (res) => {
          const data = await res.json()
          if (res.status !== status.OK) {
            throw { data }
          }
          return data
        })
        throw {
          message: ERROR_MESSAGE.UNVERIFIED_EMAIL,
          code: ERROR_CODE.NOT_AUTHORIZED_EXCEPTION
        }
      }
    } else {
      // Handle case login by alternative primary email
      // If primary email is not verify, throw error
      if (!isPrimaryEmailVerified) {
        throw {
          message: ERROR_MESSAGE.PRIMARY_UNVERIFIED_EMAIL,
          code: ERROR_CODE.NOT_AUTHORIZED_EXCEPTION
        }
      }

      // If alternative email is not verify, re-send email and throw error
      if (!isCurrentUserVerifiedEmail) {
        await fetch(`${settings.api.uamBaseUrl}/email/resend-verification/${altEmail}`, {
          method: 'GET'
        }).then(async (res) => {
          const data = await res.json()
          if (res.status !== status.OK) {
            throw {
              data
            }
          }
          return data
        })
        throw {
          message: ERROR_MESSAGE.UNVERIFIED_EMAIL,
          code: ERROR_CODE.NOT_AUTHORIZED_EXCEPTION
        }
      }
    }
    console.log('RESEND:authenticationResult', authenticationResult)
    const newEmail = EMAIL_REGEX.test(altEmail) ? altEmail : primaryEmail
    const session = Session.get(uid)
      .setEmail(newEmail)
      .setUsername(username)
      .setMfaType(authenticationResult.ChallengeName)
      .setChallengeParameters(authenticationResult.ChallengeParameters)
      .setSessionInfo(authenticationResult.Session)
    logger.debug(session, 'login session')
    switch (session.mfaType) {
      case 'NEW_PASSWORD_REQUIRED':
      case 'SMS_MFA':
      case 'SOFTWARE_TOKEN_MFA': {
        return res.json({ step: authenticationResult.ChallengeName })
      }
      case 'MFA_SETUP': {
        await setupMFA({
          res,
          newEmail,
          username,
          uid,
          step: 'MFA_SETUP'
        })
        break
      }
      default:
    }
  } catch (err) {
    logger.error(err, '/login - error:')
    next(err)
  }
}

const publishReferral = async (req, uid) => {
  const referralIdentifier = getCookie(REFERRAL_COOKIE_NAME, req.cookie || req.cookies || req.Cookie)
  logger.info(referralIdentifier, 'Referral Identifier')
  // publish to kafka
  if (referralIdentifier) {
    try {
      await fetch(`${settings.api.uamBaseUrl}/users/publish-referral`, {
        method: 'post',
        body: JSON.stringify({ referralIdentifier, email: Session.get(uid).email })
      })
    } catch (error) {
      logger.error(error, 'PublishReferral Error')
    }
  }
}

const verifyMFACode = async (req, res) => {
  const { uid } = await oidcProvider.interactionDetails(req, res)
  const code = req.body.code

  const authResult = await CognitoIdentityServiceProvider.adminRespondToAuthChallenge({
    ClientId: settings.cognito.userPoolClientId,
    UserPoolId: settings.cognito.userPoolId,
    ChallengeName: Session.get(uid).mfaType,
    ChallengeResponses: {
      USERNAME: Session.get(uid).challengeParameters.USER_ID_FOR_SRP,
      SOFTWARE_TOKEN_MFA_CODE: code
    },
    Session: Session.get(uid).sessionInfo
  }).promise()
  const decodedIdToken = await decodeToken(authResult.AuthenticationResult.IdToken)
  // Publish referral id to kafka
  await publishReferral(req, uid)
  // map user
  await Account.saveAccount(decodedIdToken.sub, {
    ...decodedIdToken,
    sessionId: uid,
    email: Session.get(uid).email
  })
  const result = {
    select_account: {},
    login: {
      account: decodedIdToken.sub,
      ...decodedIdToken
    }
  }
  const redirect = await oidcProvider.interactionResult(req, res, result, {
    mergeWithLastSubmission: false
  })
  return res.status(status.OK).json({ redirect: redirect, user: decodedIdToken })
}

const verifyEmail = async (req, res) => {
  const { error, userId, subUserId, sentAt, templateType, execute, isAdminCreated } = req.query
  try {
    if (error || isAdminCreated) {
      return res.sendFile(path.join(CLIENT_DIR_PATH, 'index.html'))
    }
    if (execute === 'true') {
      let checkVerifyEmail = await fetch(
        `${settings.api.uamBaseUrl}/email-verification`,
        {
          method: 'post',
          body: JSON.stringify({ userId, subUserId, sentAt, templateType })
        }
      )
      checkVerifyEmail = await checkVerifyEmail.json()
      if (checkVerifyEmail.type === 'error') { throw new BadRequestError(checkVerifyEmail.message) }

      // User created by Admin
      if (checkVerifyEmail.type && checkVerifyEmail.type === 'isAdminCreated') {
        return res.send(`<html>
        <head>
          <script>
            window.location = "${settings.oidc.issuer}${req.originalUrl}&isAdminCreated=true";
          </script>
        </head>
        <body>
        </body>
        </html>`)
      }

      return res.sendFile(path.join(CLIENT_DIR_PATH, 'index.html'))
    }

    // Avoid multiple click the link when using Outlook SafeLinks
    return res.send(`<html>
    <head>
      <script>
        window.location = "${settings.oidc.issuer}${req.originalUrl}&execute=true";
      </script>
    </head>
    <body>
    </body>
    </html>`)
  } catch (error) {
    logger.error(error, '[Error] Email verification: ')
    return res.redirect(
      status.MOVED_PERMANENTLY,
      `${
        settings.oidc.issuer
      }/interaction/email/verification?error=true&message=${encodeURIComponent(
        error.message
      )}`
    )
  }
}

const generateIssuer = () => {
  const prodEnvs = ['production', 'prod', 'staging', 'stg']
  if (settings.qrCodeEnv && prodEnvs.includes(settings.qrCodeEnv.toLowerCase())) {
    return 'FUSANG'
  }
  return `FUSANG%20-%20${settings.qrCodeEnv}`
}

const getQRCodeLink = ({ username, secret }) => {
  return `otpauth://totp/${username}?secret=${secret}&issuer=${generateIssuer()}`
}

const setupMFA = async ({ res, username, newEmail, uid, step }) => {
  const softwareTokenAssociationResult = await CognitoIdentityServiceProvider.associateSoftwareToken({
    Session: Session.get(uid).sessionInfo
  }).promise()
  Session.get(uid).setSessionInfo(softwareTokenAssociationResult.Session).setMfaSecret(softwareTokenAssociationResult.SecretCode) // Save MFA Code to re-use in the completeMFASetup step.

  const qrCodeLink = getQRCodeLink({
    username,
    secret: softwareTokenAssociationResult.SecretCode
  })
  await CognitoIdentityServiceProvider.adminSetUserMFAPreference({
    UserPoolId: settings.cognito.userPoolId,
    Username: Session.get(uid).challengeParameters.USER_ID_FOR_SRP,
    SoftwareTokenMfaSettings: {
      Enabled: true,
      PreferredMfa: true
    }
  }).promise()

  const waitTime = authenticator.timeRemaining()

  return res.json({
    step,
    qrCodeLink,
    code: softwareTokenAssociationResult.SecretCode,
    email: newEmail,
    waitTime
  })
}

const completeMFASetup = async (req, res) => {
  const { uid } = await oidcProvider.interactionDetails(req, res)
  const code = req.body.code

  const softwareTokenVerificationResult = await CognitoIdentityServiceProvider.verifySoftwareToken({
    Session: Session.get(uid).sessionInfo,
    UserCode: code
  }).promise()

  const authenticationResult = await CognitoIdentityServiceProvider.adminRespondToAuthChallenge({
    ClientId: settings.cognito.userPoolClientId,
    UserPoolId: settings.cognito.userPoolId,
    ChallengeName: Session.get(uid).mfaType,
    ChallengeResponses: {
      USERNAME: Session.get(uid).challengeParameters.USER_ID_FOR_SRP
    },
    Session: softwareTokenVerificationResult.Session,
    ClientMetadata: {
      firstSignIn: 'true'
    }
  }).promise()

  const decodedIdToken = await decodeToken(authenticationResult.AuthenticationResult.IdToken)

  const session = Session.get(uid).setSessionInfo(authenticationResult.Session)
  await Account.saveAccount(decodedIdToken.sub, {
    ...decodedIdToken,
    sessionId: uid,
    email: session.email
  })

  // Save MFA Secret to the server
  const mfaSecret = Session.get(uid).mfaSecret
  await fetch(`${settings.api.uamBaseUrl}/users/backup-mfa/${session.email}`, {
    method: 'post',
    body: JSON.stringify({ email: session.email, secret: mfaSecret })
  })
  // Publish referral id to kafka
  await publishReferral(req, uid)

  // map user
  const result = {
    select_account: {},
    login: {
      account: decodedIdToken.sub,
      ...decodedIdToken
    }
  }
  const redirect = await oidcProvider.interactionResult(req, res, result, {
    mergeWithLastSubmission: false
  })
  return res.json({ redirect: redirect, user: decodedIdToken })
}

const completeForcedPasswordChange = async (req, res) => {
  const { uid } = await oidcProvider.interactionDetails(req, res)
  const { email, username } = Session.get(uid)
  const newPassword = req.body.newPassword

  // Check account valid before complete new password
  await Account.findByLogin(email)

  await verifyPassword(email, newPassword)

  const authenticationResult = await CognitoIdentityServiceProvider.adminRespondToAuthChallenge({
    ClientId: settings.cognito.userPoolClientId,
    UserPoolId: settings.cognito.userPoolId,
    ChallengeName: Session.get(uid).mfaType,
    ChallengeResponses: {
      USERNAME: Session.get(uid).challengeParameters.USER_ID_FOR_SRP,
      NEW_PASSWORD: newPassword
    },
    Session: Session.get(uid).sessionInfo
  }).promise()

  await updateRecentPasswords(Session.get(uid).challengeParameters.USER_ID_FOR_SRP, newPassword)

  Session.get(uid).setMfaType(authenticationResult.ChallengeName).setSessionInfo(authenticationResult.Session)
  await setupMFA({
    res,
    newEmail: email,
    username,
    uid,
    step: authenticationResult.ChallengeName
  })
}

export { initLoginPage, login, verifyMFACode, verifyEmail, completeMFASetup, completeForcedPasswordChange }
