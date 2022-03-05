import fs from 'fs'
import path from 'path'
import express from 'express'
import crypto from 'crypto'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import cors from 'cors'
import nocache from 'nocache'
import fetch from 'node-fetch'
import status from 'http-status'
import { settings, logger } from '@fsi/core'

import Router from './routes'
import { oidcProvider } from './utils/oidcProvider'
import enforceHttps from './utils/enforceHttps'
import { CLIENT_DIR_PATH } from './constants/setting'
import defaultErrorHandler from './utils/defaultErrorHandler'
global.fetch = fetch
global.crypto = crypto

const app = express()
app.use(cookieParser())
if (settings.oidc.env === 'production') {
  app.enable('trust proxy')
  app.use(enforceHttps)
}
// app.use(
//   cors(settings.oidc.corsEnabled === 'false' ? {
//     credentials: true
//   } : {
//     origin: [/fusang\.co(:\d{1,5})?$/],
//     credentials: true,
//     allowedHeaders: 'Content-Type,Cookie'
//   })
// )
app.use(
  cors({
    origin: [ /fusang\.co(:\d{1,5})?$/, /localhost(:\d{1,5})?$/ ],
    credentials: true,
    allowedHeaders: 'Content-Type,Cookie, cookie'
  })
)
app.get('/', (req, res) => {
  return res.sendFile(path.join(CLIENT_DIR_PATH, 'index.html'))
})
app.get('/profile', (req, res) => {
  return res.sendFile(path.join(CLIENT_DIR_PATH, 'index.html'))
})
app.use('/public', express.static(CLIENT_DIR_PATH))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(nocache())
app.use(Router)
app.use(defaultErrorHandler)

app.use(oidcProvider.callback)
oidcProvider.use(async (ctx, next) => {
  await next()

  if (ctx.response.status === status.NOT_FOUND) {
    ctx.type = 'html'
    ctx.body = fs.readFileSync(path.join(CLIENT_DIR_PATH, 'index.html'))
  }
})

const port = settings.oidc.port
app.listen(port, () => {
  logger.info(`App is running on port ${port}`)
})
