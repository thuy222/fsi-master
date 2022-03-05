import { settings } from '@fsi/core'

const getApplicationName = async function (appId, idToken) {
  let appName
  try {
    appName = settings.cognito.fusangAppClientId === appId ? 'FSI' : undefined
    console.log('getApplicationName', appId, appName)
    const response = await fetch(
      `${settings.api.uamBaseUrl}/applications/${appId}`,
      {
        method: 'get',
        headers: {
          cookie: `id_token=${idToken}`
        }
      }
    )
    console.log('response', response)
    if (response.ok) {
      const appInfo = await response.json()
      console.log('App Info', appInfo)
      return appInfo.application.shortName || appName
    }
  } catch (e) {
    console.log('Get application error', e)
  }
  return appName
}

export { getApplicationName }
