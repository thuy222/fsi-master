/* eslint-disable camelcase */
import jwt_decode from 'jwt-decode'
import status from 'http-status'
import { settings, logger } from '@fsi/core'
import { APP_CLIENT } from '../../constants/setting'
import { ERROR_MESSAGE, ERROR_CODE } from '../../constants/error'
import lodash from 'lodash'
import { getApplicationName } from '../../utils/application'

const authorize = (req, res) => {
  const redirectLink =
    `${settings.cognito.proxyBaseUrl}/authorize?` +
    `identity_provider=${settings.oidc.providerName}` +
    `&client_id=${APP_CLIENT.client_id}` +
    '&response_type=code' +
    '&scope=email+openid+aws.cognito.signin.user.admin' +
    `&code_challenge=${req.query.code_challenge}` +
    '&code_challenge_method=S256' +
    `&redirect_uri=${req.query.redirect_uri}`
  return res.send(`
    <html>
      <head>
        <script>
          window.location = "${redirectLink}";
          window.sessionStorage.setItem("redirectLink", "${req.query.redirect_uri}");
        </script>
      </head>
      <body>
      </body>
    </html>
    `)
}

const createLoginAuditLog = async function (user, appName, rejected, idToken) {
  return fetch(
    `${settings.api.uamBaseUrl}/audit-logs`,
    {
      method: 'post',
      headers: {
        cookie: `id_token=${idToken}`
      },
      body: JSON.stringify({
        'source': appName || 'FSI',
        'module': 'auth',
        'action': 'LOGIN',
        'message': rejected ? `${user.username} failure "No access permission"` : `${user.username} success`,
        'actor': {
          'userId': user.userId,
          'username': user.username
        }
      })
    }
  )
}

const getToken = async (req, res) => {
  try {
    const idToken = req.cookies && req.cookies.id_token
    const refreshToken = req.cookies && req.cookies.refresh_token
    const {
      grant_type,
      client_id,
      code_verifier,
      code,
      redirect_uri
    } = req.body
    const body = code
      ? `grant_type=${grant_type}` +
      `&client_id=${APP_CLIENT.client_id}` +
      `&code_verifier=${code_verifier}` +
      `&code=${code}` +
      `&redirect_uri=${redirect_uri}` +
      `&client_secret=${APP_CLIENT.client_secret}`
      : `grant_type=${grant_type}` +
      `&client_id=${APP_CLIENT.client_id}` +
      `&client_secret=${APP_CLIENT.client_secret}` +
      `&refresh_token=${refreshToken}`
    const response = await fetch(
      `${settings.cognito.proxyBaseUrl}/oauth2/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body
      }
    )
    const data = await response.json()
    if (response.status === status.BAD_REQUEST) {
      return res.status(status.BAD_REQUEST).json(data)
    }
    const decodedData = jwt_decode(data.id_token)

    const appName = await getApplicationName(client_id, data.id_token)

    const userApplications = decodedData.applications || []
    if (!userApplications.includes(client_id)) {
      if (settings.cognito.fusangAppClientId !== client_id) {
        //   Write auditlog when user logon to unauthorize app
        if (code && !idToken) {
          try {
            await createLoginAuditLog(decodedData, appName, true, data.id_token)
          } catch (e) {
            logger.info('Write audit log error ' + JSON.stringify(e, null, 2))
          }
        }
        return res.status(status.FORBIDDEN).json({
          data: { reason: ERROR_MESSAGE.PERMISSION_DENIED },
          errorCode: ERROR_CODE.FORBIDDEN,
          message: ERROR_MESSAGE.PERMISSION_DENIED
        })
      }
    }
    // Only create log when user login not for refresh token
    if (code && !idToken) {
      try {
        await createLoginAuditLog(decodedData, appName, false, data.id_token)
      } catch (e) {
        logger.info('Write audit log error ' + JSON.stringify(e, null, 2))
      }
    }
    // const activeTabTime = Number(settings.common.activeTabTime)
    // Make the time between /token to /ping longer
    res.cookie('last_active_time', Date.now(), lodash.merge({
      maxAge: 60000
    }, settings.oidc.httpCookieOption, { path: '/' }))
    res.cookie('session_active_time', Date.now(), lodash.merge({}, settings.oidc.httpCookieOption, { path: '/' }))
    res.cookie('id_token', data.id_token, lodash.merge({}, settings.oidc.httpCookieOption, { path: '/' }))
    if (data.refresh_token) {
      res.cookie('refresh_token', data.refresh_token, lodash.merge({}, settings.oidc.httpCookieOption, { path: '/api/cognito/token' }))
    }
    const identity = decodedData.identities[0]

    return res.json({ ...decodedData, ...identity })
  } catch (error) {
    logger.error(error, '/cognito/token - error: ')
    return res.status(status.BAD_REQUEST).json(error)
  }
}

export { authorize, getToken }
