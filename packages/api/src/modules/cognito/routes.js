import express from 'express'

import { authorize, getToken } from './views'
import endpointWrapper from '../../utils/endpointWrapper'

const cognitoRouter = express.Router()
cognitoRouter.get('/authorization', endpointWrapper(authorize))
cognitoRouter.post('/token', endpointWrapper(getToken))
export default cognitoRouter
