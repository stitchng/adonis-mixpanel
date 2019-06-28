'use strict'

/**
 * adonis-mixpanel
 *
 * @license MIT
 * @copyright Slynova - Romain Lanz <romain.lanz@slynova.ch>
 * @extended Oparand - Ifeora Okechukwu <isocroft@gmail.com>
 */

const path = require('path')

module.exports = async function (cli) {
  try {
    await cli.makeConfig('mixpanel.js', path.join(__dirname, 'config/mixpanel.js'))
    cli.command.completed('create', 'config/mixpanel.js')
  } catch (error) {
    // ignore if mixpanel.js already exists...
  }
}
