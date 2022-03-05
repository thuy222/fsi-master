import httpStatus from 'http-status'
import { settings } from '@fsi/core'
import lodash from 'lodash'

const verifyToken = async (req, res) => {
  const idToken = req.cookies.id_token
  const { clientId } = req.query
  let response = await fetch(`${settings.api.uamBaseUrl}/verify`, {
    method: 'post',
    headers: {
      Authorization: idToken
    },
    body: JSON.stringify({
      clientId
    })
  })
  const statusCode = response.status
  response = await response.json()
  return res.status(statusCode).json(response)
}

const verifyTokenWithActiveTimeCheck = async (req, res) => {
  const lastActiveTime = req.cookies.last_active_time || 0
  const activeTabTime = Number(settings.common.activeTabTime)

  const { pingTime } = req.query

  console.log('Check lastActiveTime', Date.now() - lastActiveTime, lastActiveTime, activeTabTime, pingTime)
  console.log('Check lastActiveTime pingTime', pingTime - lastActiveTime)

  // use pingTime to remove the effect of the network
  if (activeTabTime !== -1 && pingTime - lastActiveTime > activeTabTime) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      message: 'Activity expired',
      errorCode: 'ActivityExpired'
    })
  } else {
    res.cookie('last_active_time', Date.now(), lodash.merge({
      maxAge: activeTabTime
    }, settings.oidc.httpCookieOption, { path: '/' }))
    res.cookie('session_active_time', Date.now(), lodash.merge({}, settings.oidc.httpCookieOption, { path: '/' }))
    return verifyToken(req, res)
  }
}

export { verifyToken, verifyTokenWithActiveTimeCheck }
