const store = new Map()
const logins = new Map()
const { nanoid } = require('nanoid')
const { settings, logger } = require('@fsi/core')
const status = require('http-status')
const { ERROR_CODE } = require('../constants/error')
class Account {
  constructor(id, profile) {
    this.accountId = id || nanoid()
    this.profile = profile
    store.set(this.accountId, this)
  }

  /**
   * @param use - can either be "id_token" or "userinfo", depending on
   *   where the specific claims are intended to be put in.
   * @param scope - the intended scope, while oidc-provider will mask
   *   claims depending on the scope automatically you might want to skip
   *   loading some claims from external resources etc. based on this detail
   *   or not return them in id tokens but only userinfo and so on.
   */
  async claims(use, scope, claims, rejected) {
    // eslint-disable-line no-unused-vars

    return {
      sub: this.accountId, // it is essential to always return a sub claim
      username: this.profile['cognito:username'],
      ...this.profile
    }
  }

  static async findByFederated(provider, claims) {
    const id = `${provider}.${claims.sub}`
    if (!logins.get(id)) {
      logins.set(id, new Account(id, claims))
    }
    return logins.get(id)
  }

  static async findByLogin(login) {
    const url = new URL(`${settings.api.uamBaseUrl}/get-primary-email`)
    const params = {}
    const emailCheck = /(.+)@.+\..+/m
    if (emailCheck.test(login)) {
      params.email = login
    } else {
      params.username = login
    }
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    )
    logger.info({ url, params }, 'url')
    try {
      return await fetch(url, {
        method: 'GET',
        headers: { 'app-secret-key': settings.api.uamSecretKey }
      })
        .then(async (res) => {
          const data = await res.json()
          if (res.status !== status.OK) {
            throw {
              ...data,
              code: ERROR_CODE.NOT_AUTHORIZED_EXCEPTION
            }
          }
          return data
        })
    } catch (err) {
      logger.error(err, '[ERROR] Cannot find email:')
      throw err
    }
  }

  static async saveAccount(username, sessionPayload) {
    return new Account(username, sessionPayload)
  }

  static async findAccount(ctx, id, token) {
    // eslint-disable-line no-unused-vars
    // token is a reference to the token used for which a given account is being loaded,
    //   it is undefined in scenarios where account claims are returned from authorization endpoint
    // ctx is the koa request context
    if (!store.get(id)) new Account(id, {}) // eslint-disable-line no-new
    const account = store.get(id)
    return account
  }
}

module.exports = Account
