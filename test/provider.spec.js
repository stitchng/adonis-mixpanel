'use strict'

/*
 * adonis-mixpanel
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const test = require('japa')
const path = require('path')
const { Config, Env, Helpers } = require('@adonisjs/sink')
const { ioc } = require('@adonisjs/fold')
const MixPanelHttpTracker = require('../src/MixPanel/Middleware/MixPanelHttpTracker.js')
const MixPanelUserPropsTracker = require('../src/MixPanel/Middleware/MixPanelUserPropsTracker.js')
const MixPanelProvider = require('../providers/MixPanelProvider.js')
const MixPanel = require('../src/MixPanel/index.js')

test.group('AdonisJS MixPanel Provider Test(s)', (group) => {
  group.before(() => {
    ioc.singleton('Adonis/Src/Config', () => {
      let config = new Config()
      config.set('mixpanel.apiToken', 'xxxxxxxxxxxxxxxxxxxxxxxxx')
      config.set('mixpanel.trackIp', false)
      return config
    })

    ioc.singleton('Env', () => {
      let env = new Env()
      env.set('NODE_ENV', 'development')
      return env
    })

    ioc.singleton('Helpers', () => {
      let helpers = new Helpers(path.join(__dirname, '..'))
      return helpers
    })
  })

  test('provider instance registers instance(s) as expected', async (assert) => {
    let provider = new MixPanelProvider(ioc)
    provider.register()

    let mixpanel = ioc.use('MixPanel')

    assert.instanceOf(mixpanel, MixPanel)
    assert.isFunction(mixpanel.trackUserBillingCharge)
    assert.isFunction(mixpanel.trackUserMergedAttributes)
    assert.isFunction(mixpanel.trackUserEvent)

    assert.instanceOf(ioc.use('Adonis/Middleware/MixPanelHttpTracker'), MixPanelHttpTracker)
    assert.instanceOf(ioc.use('Adonis/Middleware/MixPanelUserPropsTracker'), MixPanelUserPropsTracker)
  })
})
