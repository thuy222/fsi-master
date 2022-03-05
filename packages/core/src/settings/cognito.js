const { env } = process

module.exports = {
  proxyBaseUrl: env.COGNITO_PROXY_BASE_URL || 'https://co-fsi-dev2.auth.ap-southeast-1.amazoncognito.com',
  region: env.COGNITO_REGION || 'ap-southeast-1',
  userPoolId: env.COGNITO_USER_POOL_ID || 'ap-southeast-1_1RjQ2oqOM',
  userPoolClientId: env.COGNITO_USER_POOL_CLIENT_ID || '1trlccrisnhuei0losh55aa85q',
  fusangAppClientId: env.FUSANG_APPS_CLIENT_ID || '2m7ivvrk266igjd6400dep25c3',
  fusangAppClientSecret: env.FUSANG_APPS_CLIENT_SECRET || 'f8lq4kuhuknbhf7s5q2sb3kmpkllnnqor0ce0u10bsd6llrm6lv',
  temporaryPasswordExpired: env.TEMPORARY_PASSWORD_EXPIRED || (5 * 60)
}
