'use strict'

class MixPanelUserPropsTracker {
  constructor (mixpanel) {
    this.mixpanel = mixpanel
  }

  async handle ({ request, auth, session }, next, settings = []) {

    let parsed = this.parseSetting(settings)
    let user = request.user

    try {
      if (!user) { user = await auth.getUser() }
    } catch (_) {
      user = {}
    }

    if (parsed.length !== 0) {
      parsed.forEach((_parsed) => {
        let [ store, accessor ] = _parsed.data || ['_', '_']
        let context = {}

        const canGetFromSession = store === 'session' 
          ? !!session && typeof session[accessor] === 'function'
          : false

        context[store] = (
          canGetFromSession ? session[accessor]()
            : (store === 'cookie'
              ? request.cookies() : {}))

        switch (_parsed.mark) {
          case 'user_login':
          case 'user_logout':
            context['_tag'] = user[_parsed.username]
            this.mixpanel.trackEvent(_parsed.mark, Object.assign(
              {},
              {
                _context: context
              }
            ))
            break
          case 'user_updated':
            this.mixpanel.trackUserMergedAttributes(
              user,
              {
                _context: context
              }
            )
            break
        }
      })
    }

    await next()
  }

  parseSetting (settings) {
    /* @SAMPLE:

      [
        'user_logout;email',
        'user_login;email|session.all' ,
        'user_updated;full_name|cookie.all'
      ]
    
    */

    const result = []

    settings.forEach(function (setting) {
      let parsed = {}

      let [ mark, userprops ] = setting.split(';')
      let [ username, storage ] = userprops.split('|')

      parsed.mark = mark
      parsed.username = username
      parsed.data = storage.split('.')

      result.push(parsed)
    });

    return result;
  }
}

module.exports = MixPanelUserPropsTracker
