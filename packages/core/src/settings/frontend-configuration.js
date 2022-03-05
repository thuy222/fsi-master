const cognito = require('./cognito')
const common = require('./common')
const { env } = process

module.exports = {
  NODE_ENV: env.NODE_ENV || 'development',
  PUBLIC_URL: env.PUBLIC_URL || '/public',
  REACT_APP_CLIENT_ID: env.REACT_APP_CLIENT_ID || cognito.fusangAppClientId,
  REACT_APP_REDIRECT_URI:
    env.REACT_APP_REDIRECT_URI || 'http://localhost:3201',
  REACT_APP_OIDC_BASE_URL:
    env.REACT_APP_OIDC_BASE_URL || 'http://localhost:3201',
  REACT_APP_BUILD_VERSION: env.REACT_APP_BUILD_VERSION || '1.2.5',
  REACT_APP_ENVIRONMENT: common.envName,
  REACT_APP_FUSANG_SUPPORT_EMAIL: env.FUSANG_SUPPORT_EMAIL || 'support@fusang.co'
}
