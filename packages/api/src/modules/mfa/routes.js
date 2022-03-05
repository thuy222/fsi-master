import express from 'express'

import { verifyCode } from './views'
import endpointWrapper from '../../utils/endpointWrapper'

const mfaRouter = express.Router()
mfaRouter.get('/verification', endpointWrapper(verifyCode))
export default mfaRouter
