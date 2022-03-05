import fs from 'fs'
import status from 'http-status'

import { settings, oidc } from '@fsi/core'

import Account from './account'
import { CLIENT_DIR_PATH } from '../constants/setting'

const oidcProvider = oidc.provider(Account.findAccount)
if (settings.oidc.env === 'production') {
  oidcProvider.proxy = true
}

oidcProvider.use(async (ctx, next) => {
  await next()

  if (ctx.response.status === status.NOT_FOUND) {
    ctx.type = 'html'
    ctx.body = fs.readFileSync(`${CLIENT_DIR_PATH}/index.html`)
  }
})

const SessionNotFound = oidcProvider.constructor.errors.SessionNotFound

export { oidcProvider, SessionNotFound }
