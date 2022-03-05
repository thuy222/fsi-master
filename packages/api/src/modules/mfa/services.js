import { authenticator } from 'otplib'
import status from 'http-status'
import isNil from 'lodash/isNil'

import { settings } from '@fsi/core'
import { ERROR_MESSAGE } from '../../constants/error'

import decodeToken from '../../utils/decodeToken'
import BadRequestError from '../../errors/badRequestError'

const verifyCode = async (idToken, code) => {
  let decodedIdToken
  try {
    decodedIdToken = await decodeToken(idToken)
  } catch (error) {
    throw new BadRequestError(ERROR_MESSAGE.INVALID_ID_TOKEN)
  }

  const getUserResponse = await fetch(
    `${settings.api.uamBaseUrl}/users/${decodedIdToken.identities[0].userId}`,
    {
      method: 'GET',
      headers: {
        Cookie: `id_token=${idToken}`
      },
      credentials: 'include'
    }
  )
  const getUserResult = await getUserResponse.json()
  if (getUserResponse.status === status.BAD_REQUEST) {
    throw new BadRequestError(getUserResult.message)
  }
  if (isNil(getUserResult.Item)) {
    throw new BadRequestError(`User ${decodedIdToken.identities[0].userId} doesn't exist`)
  }

  const mfaInfoResponse = await fetch(`${settings.api.uamBaseUrl}/user/mfa/${getUserResult.Item.primaryEmailSortable}`)
  const mfaInfoResult = await mfaInfoResponse.json()
  if (mfaInfoResponse.status === status.BAD_REQUEST) {
    throw new BadRequestError(mfaInfoResult.message)
  }
  if (!authenticator.check(code, mfaInfoResult.secret)) {
    throw new BadRequestError(ERROR_MESSAGE.MFA_CODE_MISMATCH)
  }
  return true
}

export { verifyCode }
