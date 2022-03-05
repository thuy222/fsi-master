import status from 'http-status'

import { ERROR_MESSAGE } from '../constants/error'

export default class BadRequestError extends Error {
  /**
   * Constructor of BadRequestError
   * @param {string} [message=undefined] - the error message
   * @param {Object} [details=undefined] - details of the error
   */
  constructor(message = undefined, details = undefined) {
    super()
    this.code = status.BAD_REQUEST
    this.message = message || ERROR_MESSAGE.BAD_REQUEST
    this.details = details
  }
}

export class PasswordExpiredError extends Error {
  /**
   * Constructor of BadRequestError
   * @param {string} [message=undefined] - the error message
   * @param {Object} [details=undefined] - details of the error
   */
  constructor(message = undefined, details = undefined) {
    super()
    this.code = 'TEMPORARY_PASSWORD_EXPIRED'
    this.message = message || ERROR_MESSAGE.BAD_REQUEST
    this.details = details
  }
}
