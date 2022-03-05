// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode'
import parser from 'ua-parser-js'
import { settings, logger } from '@fsi/core'
import { UAM_API_PATH } from '../../constants/api-path'
import { APP_CLIENT } from '../../constants/setting'
import { getApplicationName } from '../../utils/application'
import { CognitoIdentityServiceProvider } from '../../utils/awsUtils'
import { getLocationByIpAddress } from '../../utils/auditlLogs'

const logout = async (req, res, next) => {
  try {
    const idToken = req.cookies.id_token
    const lastActiveTime = req.cookies.session_active_time
    if (idToken) {
      const appName = await getApplicationName(req.query.client_id, idToken)
      const tokenPayload = jwt_decode(idToken)
      const userId = tokenPayload.identities[0].userId
      let revokeResponse = await fetch(`${settings.api.uamBaseUrl}/revokeUser`, {
        method: 'post',
        body: JSON.stringify({
          sub: userId
        })
      })
      if (!revokeResponse.ok) {
        revokeResponse = await revokeResponse.json()
        logger.error(revokeResponse, '[Termination] /revokeUser error')
        throw revokeResponse
      }
      try {
        await CognitoIdentityServiceProvider.adminUserGlobalSignOut({
          UserPoolId: settings.cognito.userPoolId,
          Username: userId
        }).promise()
        const ipAddress = req.headers['x-forwarded-for'] && req.headers['x-forwarded-for'].split(',').shift()
        const location = getLocationByIpAddress(ipAddress)
        console.log('location', location)
        const userAgent = parser(req.headers['user-agent'])
        await writeLogoutLog(userId, req.query.reason, appName, req.query.actorUserId, userAgent, ipAddress, location, lastActiveTime)
      } catch (e) {
        logger.error(e, '[Termination] adminUserGlobalSignOut error')
      }
    }

    // let cookie = req.cookies
    // for (var prop in cookie) {
    //   if (!cookie.hasOwnProperty(prop)) {
    //     continue
    //   }
    //   res.clearCookie(prop, {
    //     domain: '.fusang.co',
    //     path: '/'
    //   })
    // }

    res.clearCookie('_session.legacy.sig')
    res.clearCookie('_session.legacy')
    res.clearCookie('_session.sig')
    res.clearCookie('_session')
    res.clearCookie('id_token', { domain: '.fusang.co', path: '/' })
    res.clearCookie('refresh_token', { domain: '.fusang.co', path: '/' })
    res.clearCookie('in_logout_process', { domain: '.fusang.co', path: '/' })

    res.set('Content-Type', 'text/html')
    return res.send(`<html>
    <head>
      <script>
        localStorage.clear();
        window.location = "${settings.cognito.proxyBaseUrl}/logout?client_id=${APP_CLIENT.client_id}&logout_uri=${req.query.logout_uri}";
      </script>
    </head>
    <body>
    </body>
    </html>`)
  } catch (e) {
    logger.error(e, '[Termination] revoke user error')
    next(e)
  }
}

const writeLogoutLog = async (userId, reason, appName, actorUserId, userAgent, ipAddress, location, lastActiveTime) => {
  console.log('lastActiveTime', lastActiveTime)
  const browser = `${userAgent.browser.name} ${userAgent.browser.version}`
  const os = `${userAgent.os.name} ${userAgent.os.version}`
  const from = location && [location.city, location.country].filter(Boolean).join(', ')
  if (reason && reason !== 'LOGOUT_BY_ANOTHER_TAB') {
    let logoutLogResponse = await fetch(`${settings.api.uamBaseUrl}${UAM_API_PATH.AUDIT_LOGS.LOGOUT}`, {
      method: 'post',
      body: JSON.stringify({
        userId,
        reason,
        source: appName,
        actorUserId,
        ipAddress,
        browser,
        os,
        location: from,
        lastActiveTime
      })
    })
    if (!logoutLogResponse.ok) {
      logoutLogResponse = await logoutLogResponse.json()
      logger.error(logoutLogResponse, '[Termination] Write logout log error')
    }
  }
}

export { logout }
