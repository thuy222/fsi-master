import { settings } from '@fsi/core'
import { UAM_API_PATH } from '../constants/api-path'
import BadRequestError from '../errors/badRequestError'

const verifyPassword = async (email, password) => {
  let passwordVerificationResponse = await fetch(`${settings.api.uamBaseUrl}${UAM_API_PATH.USER.PASSWORD_VERIFICATION}`, {
    method: 'post',
    body: JSON.stringify({ email, password })
  })
  passwordVerificationResponse = await passwordVerificationResponse.json()
  if (passwordVerificationResponse.type === 'error') { throw new BadRequestError(passwordVerificationResponse.message) }
}

const updateRecentPasswords = async (userId, password) => {
  let recentPasswordsResponse = await fetch(`${settings.api.uamBaseUrl}${UAM_API_PATH.USER.RECENT_PASSWORDS}`, {
    method: 'put',
    body: JSON.stringify({ userId, password, userPoolId: settings.cognito.userPoolId })
  })
  recentPasswordsResponse = await recentPasswordsResponse.json()
  if (recentPasswordsResponse.type === 'error') { throw new BadRequestError(recentPasswordsResponse.message) }
}

export { verifyPassword, updateRecentPasswords }
