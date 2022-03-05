import express from 'express'

import { getClientConfiguration, getApplicationConfiguration } from './views'
import endpointWrapper from '../../utils/endpointWrapper'

const configurationRouter = express.Router()
configurationRouter.get('/', endpointWrapper(getClientConfiguration))
configurationRouter.get('/applications/:applicationId', endpointWrapper(getApplicationConfiguration))
export default configurationRouter
