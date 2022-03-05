import express from 'express'

import { getUserProfile, signUp, getCurrentInfo } from './views'
import endpointWrapper from '../../utils/endpointWrapper'

const userRouter = express.Router()
userRouter.post('/', endpointWrapper(signUp))
userRouter.get('/me', endpointWrapper(getCurrentInfo))
userRouter.get('/profile', endpointWrapper(getUserProfile))
export default userRouter
