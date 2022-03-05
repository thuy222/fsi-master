const { env } = process

module.exports = {
  fsxClientId: env.FSX_COGNITO_CLIENT_ID || 'kv23UB8WDUB9FIB2',
  fsxBackendClientId: env.FSX_BACKEND_CLIENT_ID || '5SC4Dl2orE2HpYf8',
  fsxBackendClientSecret: env.FSX_COGNITO_BACKEND_CLIENT_SECRET || 'eIz0Y6RAxzu1fBa1G7Px41BLVUYkdjou',
  fsxClientRedirectUrl: env.FSX_REDIRECT_URL
    ? env.FSX_REDIRECT_URL.split(',')
    : ['https://uat.exchange.fusang.co/Assets/SignIn.html', 'https://uat.exchange.fusang.co/Assets/SilentAuth.html', 'https://uat.exchange.fusang.co/sign-in']
}
