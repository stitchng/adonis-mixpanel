'use strict'

class MixPanelHttpTracker {
  constructor (mixpanel, Config) {
    this.mixpanel = mixpanel
    this.trackIp = Config.get('mixpanel.trackIp')
  }

  async handle ({ request, response, session }, next) {
    let isUserLoggedIn = (parseInt(session.get('adonis-auth')) === 1)
    let method = request.method().toLowerCase()

    let options = {
      method: method,
      payload: (/^(?:head|get)$/.test(method) ? request.get() : request.post()),
      requestHeaders: request.headers(),
      requestCookies: request.plainCookies(),
      language: request.language(['en', 'fr', 'es']),
      requestUrl: request.originalUrl(),
      isAjax: request.ajax(),
      browser: request.header('User-Agent'),
      referer: request.header('Referer'),
      scheme: request.protocol(),
      timestamp: Date.now(),
      userLoggedIn: isUserLoggedIn
    }

    if (this.trackIp) {
      options.ip = request.ip()
    }

    await next()

    options.responseHeaders = []
    options.responseStatusCode = response.response.statusCode

    this.mixpanel.trackEvent('http-trail', options)
  }
}

module.exports = MixPanelHttpTracker
