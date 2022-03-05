import status from 'http-status'

import { settings } from '@fsi/core'

import { UAM_API_PATH } from '../../constants/api-path'
import { CognitoIdentityServiceProvider } from '../../utils/awsUtils'
import { verifyPassword } from '../../utils/auth'
import BadRequestError from '../../errors/badRequestError'

const AUDIT_LOG_SOURCE = 'FSI'

const changePassword = async (req, res) => {
  const { mfaCode, oldPassword, newPassword, email } = req.body

  const authenticationResult = await CognitoIdentityServiceProvider.adminInitiateAuth({
    ClientId: settings.cognito.userPoolClientId,
    UserPoolId: settings.cognito.userPoolId,
    AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
    AuthParameters: {
      USERNAME: email,
      PASSWORD: oldPassword
    }
  }).promise()

  await verifyPassword(email, newPassword)

  const respondAuthChallengeResult = await CognitoIdentityServiceProvider.adminRespondToAuthChallenge({
    ClientId: settings.cognito.userPoolClientId,
    UserPoolId: settings.cognito.userPoolId,
    ChallengeName: authenticationResult.ChallengeName,
    ChallengeResponses: {
      USERNAME: authenticationResult.ChallengeParameters.USER_ID_FOR_SRP,
      SOFTWARE_TOKEN_MFA_CODE: mfaCode
    },
    Session: authenticationResult.Session
  }).promise()

  await CognitoIdentityServiceProvider.changePassword({
    AccessToken: respondAuthChallengeResult.AuthenticationResult.AccessToken,
    PreviousPassword: oldPassword,
    ProposedPassword: newPassword
  }).promise()

  await fetch(`${settings.api.uamBaseUrl}${UAM_API_PATH.USER.PASSWORD}`, {
    method: 'put',
    headers: {
      Cookie: `id_token=${req.cookies.id_token}`
    },
    credentials: 'include',
    body: JSON.stringify({ email, source: AUDIT_LOG_SOURCE, newPassword })
  })
  res.sendStatus(status.OK)
}

const initPasswordRecovery = async (req, res) => {
  const email = req.body.email
  const forgotPasswordResult = await CognitoIdentityServiceProvider.forgotPassword({
    ClientId: settings.cognito.userPoolClientId,
    Username: email
  }).promise()
  return res.json(forgotPasswordResult)
}

const confirmPasswordRecovery = async (req, res) => {
  const { email, code, newPassword } = req.body

  // Verify password
  await verifyPassword(email, newPassword)

  await CognitoIdentityServiceProvider.confirmForgotPassword({
    ClientId: settings.cognito.userPoolClientId,
    Username: email,
    ConfirmationCode: code,
    Password: newPassword
  }).promise()

  let forgotPasswordResponse = await fetch(`${settings.api.uamBaseUrl}/forgot-password`, {
    method: 'post',
    body: JSON.stringify({ email, password: newPassword })
  })
  forgotPasswordResponse = await forgotPasswordResponse.json()

  if (forgotPasswordResponse.type === 'error') { throw new BadRequestError(forgotPasswordResponse.message) }
  res.sendStatus(status.OK)
}

export { changePassword, initPasswordRecovery, confirmPasswordRecovery }
