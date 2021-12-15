'use strict'

class MixPanelHttpTracker {
  constructor (mixpanel, Config) {
    this.mixpanel = mixpanel
    this.trackIp = Config.get('mixpanel.trackIp')
  }

  async handle ({ request, response, session, auth }, next) {
    const canGetFromSession = session && typeof session.get === 'function'

    let method = request.method().toLowerCase()

    let options = {
      method: method,
      payload: (/^(?:head|get)$/.test(method) ? request.get() : request.post()),
      requestHeaders: request.headers(),
      requestCookies: request.plainCookies(),
      language: request.language(['en', 'fr', 'es', 'cy', 'da', 'de', 'el', 'fa', 'fi', 'ga', 'gd']),
      requestUrlPath: request.originalUrl(),
      isAjax: request.ajax(),
      httpClient: request.header('User-Agent'),
      referer: request.header('Referer'),
      origin: typeof request.origin === 'function'
        ? request.origin()
        : `${request.protocol()}://${request.hostname()}`
    }

    if (this.trackIp) {
      options.ip = request.ip()
    }

    await next()

    let isUserLoggedIn = canGetFromSession
      ? (parseInt(session.get('adonis-auth')) === 1)
      : !!auth.user
    const user = isUserLoggedIn ? auth.user : { toJSON: () => ({}) }

    options.userLoggedIn = isUserLoggedIn
    options.responseHeaders = response.headers() || []
    options.responseStatusCode = response.response.statusCode
    options.fingerprint = request.fingerprint()
    options.routeName = request.currentRoute().name

    try {
      this.mixpanel.trackEvent('app_server_request', options)
      this.mixpanel.trackIncrementOnUserBasicAttributes(
        user.toJSON(),
        { 'Server Requests Count': 1 }
      )
    } catch (_) {
      ;
    }
  }
}

module.exports = MixPanelHttpTracker
