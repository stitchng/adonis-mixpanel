'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

class MixPanelProvider extends ServiceProvider {
  register () {
    this.app.singleton('Adonis/Addons/MixPanel', (app) => {
      const Config = this.app.use('Adonis/Src/Config')
      // const Helpers = this.app.use('Helpers')
      const Env = this.app.use('Env')
      const MixPanel = require('../src/MixPanel/index.js')

      return new MixPanel(require('mixpanel'), Config, Env)
    })

    this.app.alias('Adonis/Addons/MixPanel', 'MixPanel')

    this.app.bind('Adonis/Middleware/MixPanelHttpTracker', (app) => {
      const Config = this.app.use('Adonis/Src/Config')
      let MixPanelHttpTracker = require('../src/MixPanel/Middleware/MixPanelHttpTracker.js')
      return new MixPanelHttpTracker(this.app.use('Adonis/Addons/MixPanel'), Config)
    })

    this.app.bind('Adonis/Middleware/MixPanelUserPropsTracker', (app) => {
      let MixPanelUserPropsTracker = require('../src/MixPanel/Middleware/MixPanelUserPropsTracker.js')
      return new MixPanelUserPropsTracker(this.app.use('Adonis/Addons/MixPanel'))
    })
  }

  boot () {
    /* const Server = use('Server')

    Server.registerNamed({
      mixtrack:'Adonis/Middleware/MixPanelUserPropsTracker'
    }) */;
  }
}

module.exports = MixPanelProvider
