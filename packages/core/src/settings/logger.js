const { env } = process

module.exports = {
  $filter: 'deployment',
  staging: env.LOG_LEVEL || 'info',
  production: env.LOG_LEVEL || 'info',
  $default: env.LOG_LEVEL || 'debug'
}
