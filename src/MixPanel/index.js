'use strict'

class MixpanelApiClient {
  constructor (Agent, Config, Env) {
    this.client = null
    this.allowedEnvs = Config.get('mixpanel.allowedEnvs') || []
    this.aliasNameKey = Config.get('mixpanel.aliasNameKey') || ''
    this.trackIPAddress = Config.get('mixpanel.trackIP') || false
    this.distinctIdNameKey = Config.get('mixpanel.distinctIdNameKey') || ''

    this.isProd = this.allowedEnvs.includes(Env.get('NODE_ENV', ''))

    if (this.isProd) {
      this.client = Agent.init(Config.get('mixpanel.apiToken'), {
        protocol: 'https'
      })
    } else {
      this.client = Agent.init(Config.get('mixpanel.apiToken'))
    }
  }

  identifyUser (user = {}, alias = '') {
    let userName = alias || user[this.aliasNameKey] || '_'
    let id = user[this.distinctIdNameKey]

    if (this.isProd && userName !== '_') {
      this.client.alias(id, userName)
      return [userName, id]
    }

    return []
  }

  updateUserIdentification (user = {}, existingAlias = '', newAlias = '') {
    let userName = newAlias || user[this.aliasNameKey] || '_'

    if (this.isProd && userName !== '_') {
      if (!existingAlias || typeof existingAlias !== 'string') {
        this.client.alias(userName)
      }

      if (existingAlias !== userName) {
        this.client.alias(userName, existingAlias)
      }
    }

    return userName
  }

  trackUserEvent (eventName = 'event', data = {}, user = {}) {
    let id = user[this.distinctIdNameKey] || '_'

    if (this.trackIP && !data.ip) {
      throw new Error('[adonis-mixpanel]: event data need to contain ip address info to proceed')
    }

    if (this.isProd) {
      this.client.track(eventName, id !== '_' ? Object.assign(
        { distinct_id: id }, data
      ) : data)
    }
  }

  trackUserBasicAttributes (user = {}, userProp = '', options = { $ignore_time: false }) {
    let userName = user[this.aliasNameKey] || '_'

    if (userProp !== this.aliasNameKey) {
      delete user[this.aliasNameKey]
    }

    if (this.isProd && userName !== '_') {
      this.client.people.set(userName,
        userProp || user,
        userProp ? user[userProp] : options
      )
    }

    return userName
  }

  trackUserTransientAttributes (user, attribs = {}, userProp = '') {
    let userName = user[this.aliasNameKey] || '_'

    if (userProp !== this.aliasNameKey) {
      delete user[this.aliasNameKey]
    }

    if (this.isProd && userName !== '_') {
      this.client.people.set_once(userName,
        userProp,
        userProp ? user[userProp] : attribs
      )
    }

    return userName
  }

  trackIncrementOnUserBasicAttributes (user = {}, attribs = {}, userProp = '') {
    let userName = user[this.aliasNameKey] || '_'

    if (userProp !== this.aliasNameKey) {
      delete user[this.aliasNameKey]
    }

    if (this.isProd && userName !== '_') {
      this.client.people.increment(
        userName,
        userProp || attribs,
        userProp ? user[userProp] : undefined
      )
    }

    return userName
  }

  trackUserForDeletion (user = {}, options = { $ignore_time: false, $ignore_alias: false }) {
    let userName = user[this.aliasNameKey] || '_'

    delete user[this.aliasNameKey]

    if (this.isProd && userName !== '_') {
      this.client.people.delete_user(userName, options)
    }

    return userName
  }

  trackUserMergedAttributes (user = {}, options = {}) {
    let userName = user[this.aliasNameKey] || '_'

    delete user[this.aliasNameKey]

    if (this.isProd && userName !== '_') {
      this.client.people.union(userName, options)
    }

    return userName
  }

  trackUserBillingCharge (user = {}, billAmount = 0) {
    let userName = user[this.aliasNameKey] || '_'

    delete user[this.aliasNameKey]

    if (this.isProd && userName !== '_') {
      this.client.people.track_charge(userName, billAmount)
    }

    return userName
  }

  unTrackUserBillingCharges (user = {}) {
    let userName = user[this.aliasNameKey] || '_'

    delete user[this.aliasNameKey]

    if (this.isProd && userName !== '_') {
      this.client.people.clear_charges(userName)
    }

    return userName
  }
}

module.exports = MixpanelApiClient
