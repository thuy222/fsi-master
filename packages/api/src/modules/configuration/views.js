import { constants, settings } from '@fsi/core'
import status from 'http-status'

const getClientConfiguration = (req, res) => {
  const { frontendConfiguration } = settings
  return res.status(status.OK).json(frontendConfiguration)
}

const getApplicationConfiguration = async (req, res) => {
  // const idToken = req.header(constants.common.AUTHORIZATION)
  const idToken = req.cookies.id_token
  const { applicationId } = req.params
  const { api: { uamBaseUrl } } = settings
  const applicationConfigurationResponse = await fetch(
    `${uamBaseUrl}/applications/${applicationId}`,
    {
      method: 'GET',
      headers: {
        Cookie: `id_token=${idToken}`
      },
      credentials: 'include'
    }
  )
  const applicationConfigurationData = await applicationConfigurationResponse.json()
  return res.status(applicationConfigurationResponse.status).json(applicationConfigurationData)
}

export { getClientConfiguration, getApplicationConfiguration }
