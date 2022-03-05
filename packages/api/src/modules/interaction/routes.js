import express from 'express'

import { initLoginPage, login, verifyMFACode, completeMFASetup, completeForcedPasswordChange, verifyEmail } from './views'
import endpointWrapper from '../../utils/endpointWrapper'

const interactionRouter = express.Router()
interactionRouter.get('/:sessionId', endpointWrapper(initLoginPage))
interactionRouter.post('/:sessionId/login', endpointWrapper(login))
interactionRouter.put('/:sessionId/mfa/setup', endpointWrapper(completeMFASetup))
interactionRouter.post('/:sessionId/mfa/verification', endpointWrapper(verifyMFACode))
interactionRouter.put('/:sessionId/password', endpointWrapper(completeForcedPasswordChange))
interactionRouter.get('/email/verification', endpointWrapper(verifyEmail))
export default interactionRouter
