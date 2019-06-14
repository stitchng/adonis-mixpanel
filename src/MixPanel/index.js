'use strict'

class MixpanelApiClient {
  constructor (Agent, Config, Env) {
    this.client = null
    if (Env.get('NODE_ENV') === 'production') {
      this.client = Agent.init(Config.get('mixpanel.apiToken'), {
        protocol: 'https'
      })
    } else {
      this.client = Agent.init(Config.get('mixpanel.apiToken'))
    }
  }

  trackEvent (eventName = 'event', options = {}) {
    this.client.track(eventName, options)
  }

  trackUserCreate (user = {}, userNameKey, options = {}) {
    let userName = user[userNameKey] || `user_${(Math.random() * 2).toString(16).replace('.', '')}`

    delete user[userNameKey]
    this.client.people.set(userName, Object.assign(
      {}, options, user)
    )

    return userName
  }

  trackUserUpdate (user = {}, userNameKey, options = {}) {
    let userName = user[userNameKey] || `user_${(Math.random() * 2).toString(16).replace('.', '')}`

    delete user[userNameKey]
    this.client.people.union(userName, Object.assign(
      {}, options, user)
    )

    return userName
  }

  trackUserBillPayment (user = {}, userNameKey, billAmount = 0) {
    let userName = user[userNameKey] || `user_${(Math.random() * 2).toString(16).replace('.', '')}`

    delete user[userNameKey]
    this.client.people.track_charge(userName, billAmount)

    return userName
  }
}

module.exports = MixpanelApiClient
