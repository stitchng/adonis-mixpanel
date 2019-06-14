'use strict'

class MixPanelUserTracker {
  constructor (mixpanel, Config) {
    this.mixpanel = mixpanel
    this.trackIp = Config.get('mixpanel.trackIp')
  }

  async handle ({ request, response, session }, next) {
    let options = {
      method: request.method(),
      requestHeaders: request.headers(),
      browser: request.header('User-Agent'),
      referer: request.header('Referer'),
      timestamp: Date.now(),
      isUserLoggedIn: (session.get('adonis-auth') === '1')
    }

    if (this.trackIp) {
      options.ip = request.ip()
    }

    await next()

    options.responseHeaders = response.headers()
    options.responseStatusCode = response.response.statusCode

    this.mixpanel.trackEvent('httpcycles', options)
  }
}

module.exports = MixPanelUserTracker
