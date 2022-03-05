import React, { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import { ConfigProvider, message } from 'antd'
import Routers from './routers'
import { GlobalStyle } from './styled/globalStyle'
import { theme } from './styled/theme'
import configureStore from './stores/store'
import { formValidateMessages } from './global-configuration'
import axiosConfig, { getWithAuth } from './utils/api-call'
import { getInstance } from '@fusang/sso-client'
import { CONFIGURATION_API_PATH, BASE_FSI_API_PATH } from './constants/api-path.constant'
import { REDIRECT_ERROR_KEY, PARAM_ERROR_KEY, REDIRECT_URI_KEY } from './constants/key.constant'

window.envConfiguration = {}
message.config({ maxCount: 1 })
axiosConfig()

const App = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const searchParam = new URLSearchParams(window.location.search)
        const errorParam = searchParam.get(PARAM_ERROR_KEY)
        const redirectParam = searchParam.get(REDIRECT_URI_KEY)
        const redirectError = sessionStorage.getItem(REDIRECT_ERROR_KEY)

        const { data } = await getWithAuth({
          uri: CONFIGURATION_API_PATH.CONFIGURATION,
          axiosConfig: {
            baseURL: BASE_FSI_API_PATH
          }
        })
        window.envConfiguration = data

        let redirectUri = data.REACT_APP_REDIRECT_URI
        if (redirectParam) {
          redirectUri = redirectParam
        }
        if (errorParam || redirectError) {
          redirectUri = data.REACT_APP_OIDC_BASE_URL
        }

        const resp = await getInstance(() => {
          return {
            clientId: data.REACT_APP_CLIENT_ID,
            redirectUri: redirectUri,
            oidcBaseUrl: data.REACT_APP_OIDC_BASE_URL
          }
        })
        if (resp && resp.baseSettings) {
          setLoading(false)
        }
      } catch (e) {
        console.log('Get config error', e)
        setLoading(false)
      }
    })()
  }, [])

  if (loading) {
    return null
  }

  console.log('APP render')
  return (
    <Provider store={configureStore(window.envConfiguration.NODE_ENV)}>
      <ConfigProvider form={{ validateMessages: formValidateMessages }}>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <Routers />
        </ThemeProvider>
      </ConfigProvider>
    </Provider>
  )
}

export default App
