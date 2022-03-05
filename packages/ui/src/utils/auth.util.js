import _ from 'lodash'
import { PASSWORD_REGEX } from '../constants/auth.constant'
import { ERROR_MESSAGE } from '../constants/message.constant'

export const validatePassword = (password, name = 'Password') => {
  const passwordRegex = new RegExp(PASSWORD_REGEX)
  if (!passwordRegex.test(password)) {
    return {
      isValid: false,
      message: `${name} does not match the password policy`
    }
  }
  return { isValid: true }
}

export const validateMFACode = (code) => {
  if (code?.length !== 6 || _.isNaN(Number(code)) || !code?.trim()) {
    return {
      isValid: false,
      message: ERROR_MESSAGE.INVALID_CODE
    }
  }
  return { isValid: true }
}
