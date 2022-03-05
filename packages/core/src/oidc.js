const OidcProvider = require('oidc-provider')
const settings = require('./settings')
const jwks = require('./jwks')

const interactions = OidcProvider.interactionPolicy.base()

const provider = (findAccount) => {
  return new OidcProvider(settings.oidc.issuer, {
    findAccount: findAccount,
    clients: [
      {
        client_id: settings.oidc.cognitoClientId,
        client_secret: settings.oidc.cognitoClientSecret,
        grant_types: ['authorization_code', 'refresh_token'],
        redirect_uris: [
          `${settings.cognito.proxyBaseUrl}/oauth2/idpresponse`,
          'http://localhost:3000',
          'http://localhost:3200',
          'http://localhost:3201'
        ]
      },
      {
        application_type: 'web',
        client_id: settings.fsxClient.fsxClientId,
        grant_types: ['authorization_code', 'refresh_token'],
        redirect_uris: settings.fsxClient.fsxClientRedirectUrl,
        token_endpoint_auth_method: 'none', 
        post_logout_redirect_uris: settings.fsxClient.fsxClientRedirectUrl
      },
      {
        client_id: settings.fsxClient.fsxBackendClientId,
        client_secret: settings.fsxClient.fsxBackendClientSecret,
        grant_types: ['authorization_code', 'refresh_token'],
        redirect_uris: settings.fsxClient.fsxClientRedirectUrl,
        post_logout_redirect_uris: settings.fsxClient.fsxClientRedirectUrl
      }
    ],
    cookies: {
      long: { signed: true, maxAge: 1 * 24 * 60 * 60 * 1000 },
      short: { signed: true, maxAge: 1 * 24 * 60 * 60 * 1000 },
      keys: ['YD4iKyFljdjf96kciAFOaPqnMQmrKR92']
    },
    claims: {
      address: ['address'],
      email: ['email', 'email_verified'],
      phone: ['phone_number', 'phone_number_verified'],
      profile: [
        'birthdate',
        'family_name',
        'gender',
        'given_name',
        'locale',
        'middle_name',
        'name',
        'nickname',
        'picture',
        'preferred_username',
        'profile',
        'updated_at',
        'website',
        'zoneinfo',
        'username',
        'custom:first_name',
        'custom:last_name'
      ]
    },
    jwks: jwks,
    interactions: {
      policy: interactions,
      url(ctx) {
        return `/interaction/${ctx.oidc.uid}`
      }
    },
    async issueRefreshToken (ctx, client, code) {
      if (!client.grantTypeAllowed('refresh_token')) {
        return false;
      }
      return code.scopes.has('offline_access') || (client.applicationType === 'web' && client.tokenEndpointAuthMethod === 'none');
    },
    scopes: ['openid', 'email', 'profile'],
    features: {
      devInteractions: { enabled: false },
      deviceFlow: { enabled: false },
      introspection: { enabled: false },
      revocation: { enabled: true }
    },
    formats: {
      AccessToken: 'jwt'
    },
    routes: {
      authorization: '/auth',
      check_session: '/session/check',
      code_verification: '/device',
      device_authorization: '/device/auth',
      end_session: '/session/end',
      introspection: '/token/introspection',
      jwks: '/jwks.json',
      pushed_authorization_request: '/request',
      registration: '/reg',
      revocation: '/token/revocation',
      token: '/token',
      userinfo: '/userinfo'
    },
    async extraAccessTokenClaims(ctx, token) {
      var { profile } = await findAccount(ctx, token.accountId, token);
      return {
        'username': profile["cognito:username"],
        'token_use': 'access',
        'client_id': token.clientId,
        'event_id': profile.event_id,
        'auth_time': profile.auth_time
      };
    },
    ttl: {
      AccessToken: 1 * 60 * 60, // 1 hour in seconds
      AuthorizationCode: 10 * 60, // 10 minutes in seconds
      IdToken: 1 * 60 * 60, // 1 hour in seconds
      DeviceCode: 10 * 60, // 10 minutes in seconds
      RefreshToken: 1 * 24 * 60 * 60 // 1 day in seconds
    }
  })
}

module.exports = {
  provider
}
