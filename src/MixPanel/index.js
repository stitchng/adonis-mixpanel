'use strict'

class MixpanelApiClient {
  constructor (Agent, Config, Env) {
    this.client = null
    this.aliasNameKey = Config.get('mixpanel.aliasNameKey')
    this.trackIPAddress = Config.get('mixpanel.trackIP')
    this.distinctIdNameKey = Config.get('mixpanel.distinctIdNameKey')

    if (Env.get('NODE_ENV') === 'production') {
      this.client = Agent.init(Config.get('mixpanel.apiToken'), {
        protocol: 'https'
      })
    } else {
      this.client = Agent.init(Config.get('mixpanel.apiToken'))
    }
  }

  identifyUser (user = {}) {
    let userName = user[this.aliasNameKey] || '_'
    let id = user[this.distinctIdNameKey]

    this.client.alias(id, userName)
    return [userName, id]
  }

  updateUserIdentification (user = {},  existingAlias, newAlias) {
    let userName = newAlias || user[this.aliasNameKey] || '_'

    if (!existingAlias || typeof existingAlias !== 'string') {
      this.client.alias(userName)
      return;
    }

    this.client.alias(userName, existingAlias)
    return userName
  }

  trackEvent (eventName = 'event', data = {}) {
    if (this.trackIP && !data.ip) {
      throw new Error('[Adonis-Mixpanel]: event data need to contain ip address info to proceed')
    }

    this.client.track(eventName, data)
  }

  trackUserBasicAttributes (user = {}, options = {}) {
    let userName = user[this.aliasNameKey] || '_'
    let id = user[this.distinctIdNameKey]

    delete user[this.distinctIdNameKey]

    this.client.people.set(userName, 
      Object.assign(
        { distinct_id: id }, user
      ),
      options
    )

    return userName
  }

  trackIncrementOnUserBasicAttributes (user = {}, attribs = {}) {
    let userName = user[this.aliasNameKey] || '_'

    delete user[this.aliasNameKey]

    this.client.people.increment(userName, attribs)
  }

  trackUserForDeletion (user = {}, options = { $ignore_time: false, $ignore_alias: false }) {
    let userName = user[this.aliasNameKey] || '_'

    delete user[this.aliasNameKey]
    this.client.people.delete_user(userName, options)

    return userName
  }

  trackUserMergedAttributes (user = {}, options = {}) {
    let userName = user[this.aliasNameKey] || '_'

    delete user[this.aliasNameKey]
    this.client.people.union(userName, options)

    return userName
  }

  trackUserBillingCharge (user = {}, billAmount = 0) {
    let userName = user[this.aliasNameKey] || '_'

    delete user[this.aliasNameKey]
    this.client.people.track_charge(userName, billAmount)

    return userName
  }
}

module.exports = MixpanelApiClient
