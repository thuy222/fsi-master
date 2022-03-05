const settings = require('./settings')
const constants = require('./constants')
const oidc = require('./oidc')
const logger = require('./logger')

logger.debug(settings.toJS(), 'settings')

module.exports = {
  settings,
  oidc,
  logger,
  constants
}
