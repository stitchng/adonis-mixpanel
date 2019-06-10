'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

class MixPanelProvider extends ServiceProvider {
  register () {
    this.app.singleton('Adonis/Addons/MixPanel', (app) => {
      const Config = this.app.use('Adonis/Src/Config')
      // const Helpers = this.app.use('Helpers')
      const Env = this.app.use('Env')
      const MixPanel = require('../src/BugSnag')

      return new MixPanel(require('mixpanel'), Config, Env)
    })

    this.app.alias('Adonis/Addons/MixPanel', 'MixPanel')
    
    this.app.bind('Adonis/Middleware/MixPanelUserTracker', (app) => {
      let MixPanelUserTracker = require('../src/MixPanel/Middleware/MixPanelUserTracker.js')
      return new MixPanelUserTracker(this.app.use('Adonis/Addons/MixPanel'))
    })
  }
}

module.exports = MixPanelProvider
