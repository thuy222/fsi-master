import status from 'http-status'
import Joi from 'joi'

import { logger } from '@fsi/core'

import { SessionNotFound } from './oidcProvider'
import BadRequestError from '../errors/badRequestError'

export default (err, req, res, next) => {
  if (err instanceof SessionNotFound) {
    return res.redirect('/')
  }

  if (err instanceof Joi.ValidationError || err instanceof BadRequestError) {
    return res.status(status.BAD_REQUEST).json(err)
  }

  logger.error(err, 'default - error: ')
  return res.status(status.INTERNAL_SERVER_ERROR).json(err)
}
