import JWT from 'jsonwebtoken'
import jwkToPem from 'jwk-to-pem'

import { settings, constants } from '@fsi/core'

let publicJsonWebKeys

const decodeToken = async (token) => {
  const header = token.split('.')[0]
  const decodedHeader = JSON.parse(Buffer.from(header, 'base64').toString('ascii'))

  if (!publicJsonWebKeys) {
    publicJsonWebKeys = await fetch(`https://cognito-idp.${settings.cognito.region}.amazonaws.com/${settings.cognito.userPoolId}/.well-known/jwks.json`).then((res) => res.json())
  }
  const jwk = publicJsonWebKeys.keys.find(key => key.kid === decodedHeader.kid)
  const pem = jwkToPem(jwk)
  return new Promise((resolve, reject) => {
    JWT.verify(token, pem, { [constants.common.ALGORITHMS]: [decodedHeader.alg] }, (error, decodedToken) => {
      if (error) return reject(error)
      resolve(decodedToken)
    })
  })
}

export default decodeToken
