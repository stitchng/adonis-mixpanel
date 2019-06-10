'use strict'

const Config = use('Config')

class MixPanelUserTracker {

  constructor (mixpanel) {
    this.mixpanelFactory = mixpanel
  }

  async handle ({ request, session, auth }, next) {
    
    await next()

  }
}

module.exports = MixPanelUserTracker
