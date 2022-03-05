import status from 'http-status'
import Joi from 'joi'
import { ERROR_MESSAGE } from '../../constants/error'

import * as mfaService from './services'

const verifyCode = async (req, res) => {
  validateVerifyCodeInput(req)
  const idToken = req.cookies.id_token
  await mfaService.verifyCode(idToken, req.query.code)
  res.sendStatus(status.OK)
}

const verifyCodeInputSchema = Joi.object({
  code: Joi.string().pattern(/^\d{6}$/).required().messages({
    'string.pattern.base': ERROR_MESSAGE.CODE_REQUIRES_6_DIGITS
  })
})

const validateVerifyCodeInput = (req, res) => {
  const queryValidationResult = verifyCodeInputSchema.validate(req.query)
  if (queryValidationResult.error) {
    throw queryValidationResult.error
  }
}

export { verifyCode }
