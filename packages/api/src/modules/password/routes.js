import express from 'express'

import { changePassword, initPasswordRecovery, confirmPasswordRecovery } from './views'
import endpointWrapper from '../../utils/endpointWrapper'

const passwordRouter = express.Router()
passwordRouter.put('/', endpointWrapper(changePassword))
passwordRouter.post('/recovery', endpointWrapper(initPasswordRecovery))
passwordRouter.put('/recovery', endpointWrapper(confirmPasswordRecovery))
export default passwordRouter
