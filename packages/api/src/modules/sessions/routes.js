import express from 'express'

import { logout } from './views'
import { verifyTokenWithActiveTimeCheck } from '../token/views'
import endpointWrapper from '../../utils/endpointWrapper'

const sessionRouter = express.Router()
sessionRouter.get('/termination', endpointWrapper(logout))
sessionRouter.get('/ping', endpointWrapper(verifyTokenWithActiveTimeCheck))
export default sessionRouter
