const { env } = process

const getHTTPCookieOptions = () => {
  if (env.OIDC_CORS_ENABLED === 'false') {
    return {
      domain: '.fusang.co'
    }
  }
  return {
    sameSite: 'None',
    httpOnly: true,
    domain: '.fusang.co',
    secure: true
  }
}

module.exports = {
  env: env.OIDC_ENV || 'development',
  httpCookieOption: getHTTPCookieOptions(),
  corsEnabled: env.OIDC_CORS_ENABLED,
  port: { $env: 'OIDC_PORT', $default: 3201 },
  issuer: env.OIDC_ISSUER || 'http://localhost:3201',
  cognitoClientId: env.OIDC_COGNITO_CLIENT_ID || 'keryWjpeY0hC',
  cognitoClientSecret:
    env.OIDC_COGNITO_CLIENT_SECRET ||
    'sRdrHdpuogkN24P19DxxKX7T44ZZFDUIuYYQH7N61qQnqYBXR2Oo2WDAq51Yg7mnjK',
  providerName: env.OIDC_PROVIDER_NAME || 'fsi-dev2'
}
