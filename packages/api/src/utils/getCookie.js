import { logger } from '@fsi/core'

export const getCookie = (name, cookie = {}) => {
  logger.info(name, '[getCookie] name')
  logger.info(cookie, '[getCookie] cookie')
  try {
    // eslint-disable-next-line no-prototype-builtins
    if (typeof cookie === 'object' && cookie.hasOwnProperty(name)) {
      return cookie[name]
    }
  } catch (e) {
    return undefined
  }
}
