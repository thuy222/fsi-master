import express from 'express'

import { verifyToken, verifyTokenWithActiveTimeCheck } from './views'
import endpointWrapper from '../../utils/endpointWrapper'

const tokenRouter = express.Router()
tokenRouter.get('/verification', endpointWrapper(verifyToken))
export default tokenRouter
export { verifyTokenWithActiveTimeCheck }
