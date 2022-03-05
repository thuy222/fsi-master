const { Record } = require('immutable')
const { Store } = require('confidence')
const oidc = require('./oidc')
const cognito = require('./cognito')
const api = require('./api')
const common = require('./common')
const frontendConfiguration = require('./frontend-configuration')
const logLevel = require('./logger')
const fsxClient = require('./fsxClient')

const { env } = process

const internals = {
  criteria: {
    mode: env.NODE_ENV,
    deployment: env.DEPLOYMENT
  }
}

internals.settings = {
  $meta: 'application settings file',
  oidc,
  cognito,
  api,
  common,
  frontendConfiguration,
  logLevel,
  fsxClient,
  qrCodeEnv: common.envName
}

internals.store = new Store(internals.settings)

const settings = Record(internals.store.get('/', internals.criteria))()
module.exports = settings
