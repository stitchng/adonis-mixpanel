'use strict'

class MixPanelUserPropsTracker {
  constructor (mixpanel) {
    this.mixpanel = mixpanel
  }

  async handle ({ request, auth, session }, next, settings = []) {
    let parsed = this.parseSetting(settings)

    await next()

    let user = request.user

    try {
      if (!user) { user = await auth.getUser() }
    } catch (_) {
      user = {}
    }

    if (parsed.length !== 0) {
      parsed.forEach((_parsed) => {
        let [ store, accessor ] = _parsed.storage
        let context = {}

        const canGetFromSession = store === 'session'
          ? !!session && typeof session[accessor] === 'function'
          : false

        if (store !== '_') {
          context[store] = (
            canGetFromSession && accessor === 'all' ? session[accessor]()
              : (store === 'cookies' && accessor === 'all'
                ? request.cookies() : {}))
        }

        switch (_parsed.mark) {
          case 'set':
            this.mixpanel.trackUserBasicAttributes(
              user,
              _parsed.userprop
            )
            break
          case 'set_once':
            this.mixpanel.trackUserTransientAttributes(
              user,
              {
                _context: context
              },
              _parsed.userprop
            )
            break
          case 'increment':
            this.mixpanel.trackIncrementOnUserBasicAttributes(
              user,
              {
                _context: context
              },
              _parsed.userprop
            )
            break
        }
      })
    }
  }

  parseSetting (settings) {
    /* @SAMPLE:

      [
        'set;email',
        'increment;visits_to_home_page',
        'set_once;|cookies.all',
        'set_once;|session.all'
      ]

    */

    const result = []

    settings.forEach(function (setting) {
      let parsed = {}

      let [ mark, aggregate ] = setting.split(';')
      let [ userprop, storage ] = aggregate.split('|')

      parsed.mark = mark
      parsed.userprop = userprop
      parsed.storage = storage ? storage.split('.') : ['_', '_']

      result.push(parsed)
    })

    return result
  }
}

module.exports = MixPanelUserPropsTracker
