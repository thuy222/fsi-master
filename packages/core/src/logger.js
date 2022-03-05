const pino = require('pino')
const settings = require('./settings')

module.exports = pino({
  name: process.env.npm_package_name,
  level: settings.logLevel,
  prettyPrint: {
    colorize: true,
    levelFirst: false,
    translateTime: true,
    ignore: 'pid,hostname'
  }
})
