const sessions = new Map()

class Session {
  constructor(uid, mfaType = null, email = null, username = null, challengeParameters = null, sessionInfo = null, mfaSecret = null) {
    this.uid = uid
    this.email = email
    this.username = username
    this.mfaType = mfaType
    this.challengeParameters = challengeParameters
    this.sessionInfo = sessionInfo
    this.mfaSecret = mfaSecret
    sessions.set(uid, this)
  }

  setMfaType(mfaType) {
    this.mfaType = mfaType
    return this
  }

  setEmail(email) {
    this.email = email
    return this
  }

  setUsername(username) {
    this.username = username
    return this
  }

  setChallengeParameters(challengeParameters) {
    this.challengeParameters = challengeParameters
    return this
  }

  setSessionInfo(sessionInfo) {
    this.sessionInfo = sessionInfo
    return this
  }

  setMfaSecret(mfaSecret) {
    this.mfaSecret = mfaSecret
    return this
  }
}

Session.add = function (uid) {
  new Session(uid)
}

Session.get = function (uid) {
  if (!sessions.get(uid)) new Session(uid)
  return sessions.get(uid)
}

module.exports = Session
