import express from 'express'

import userRouter from './modules/users/routes'
import sessionRouter from './modules/sessions/routes'
import passwordRouter from './modules/password/routes'
import cognitoRouter from './modules/cognito/routes'
import interactionRouter from './modules/interaction/routes'
import configurationRouter from './modules/configuration/routes'
import tokenRouter from './modules/token/routes'
import mfaRouter from './modules/mfa/routes'

const endpoints = [
  ['/users', userRouter],
  ['/password', passwordRouter],
  ['/sessions', sessionRouter],
  ['/cognito', cognitoRouter],
  ['/configuration', configurationRouter],
  ['/token', tokenRouter],
  ['/mfa', mfaRouter]
]

const router = express.Router()
endpoints.forEach(([path, subRouter]) => router.use(`/api${path}`, subRouter))
router.use('/interaction', interactionRouter)

export default router
