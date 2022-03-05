// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode'

import BadRequestError from '../../errors/badRequestError'
import { CLIENT_DIR_PATH } from '../../constants/setting'
import * as UserService from './services'
import { settings as coreSettings } from '@fusang/core'
import { logger } from '@fsi/core'
import { getCookie } from '../../utils/getCookie'

const REFERRAL_COOKIE_NAME = coreSettings.referral.referralIdentifierCookie.name.toLowerCase()

const getUserProfile = async (req, res) => {
  return res.sendFile(`${CLIENT_DIR_PATH}/index.html`)
}

const getCurrentInfo = async (req, res) => {
  const idToken = req.cookies.id_token
  if (idToken) {
    const decodedData = jwt_decode(idToken)
    const identity = decodedData.identities[0]
    res.json({ ...decodedData, ...identity })
  } else {
    throw new BadRequestError('Invalid IdToken')
  }
}

const signUp = async (req, res) => {
  const {
    email,
    password,
    givenName,
    lastName,
    username
  } = req.body
  const referralIdentifier = getCookie(REFERRAL_COOKIE_NAME, req.cookie || req.cookies || req.Cookie)
  logger.info(referralIdentifier, 'Referral Identifier')
  const response = await UserService.signUp({
    email,
    password,
    givenName,
    lastName,
    username,
    referralIdentifier
  })
  res.json(response)
}

export { getUserProfile, getCurrentInfo, signUp }
