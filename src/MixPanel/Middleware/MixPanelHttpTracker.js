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
      payload: request.isMethodCaheable() ? request.get() : request.post()),
      requestHeaders: request.headers(),
      requestCookies: request.plainCookies(),
      language: request.language(['en', 'fr', 'es', 'cy', 'da', 'de', 'el', 'fa', 'fi', 'ga', 'gd']),
      requestUrlPath: request.originalUrl(),
      isAjax: request.ajax(),
      httpClient: request.header('User-Agent'),
      referer: request.header('Referer'),
      origin: request.origin()
    }

    if (this.trackIp) {
      options.ip = request.ip()
    }

    await next()

    let isUserLoggedIn = canGetFromSession
      ? (parseInt(session.get('adonis-auth')) === 1)
      : !!auth.user
    let user = isUserLoggedIn ? auth.user : { toJSON: () => ({}) }

    user = user.toJSON()
    options.userLoggedIn = isUserLoggedIn
    options.responseHeaders = response.headers() || []
    options.responseStatusCode = response.response.statusCode
    options.fingerprint = request.fingerprint()
    options.routeName = request.currentRoute().name

    try {
      this.mixpanel.trackUserEvent('app_server_request', options, user)
      this.mixpanel.trackIncrementOnUserBasicAttributes(
        user,
        'server_requests_count'
      )
    } catch (_) {
      ;
    }
  }
}

module.exports = MixPanelHttpTracker
