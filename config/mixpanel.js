'use strict'

const Env = use('Env')

module.exports = {

  /*
   |--------------------------------------------------------------------------
   | API Token
   |--------------------------------------------------------------------------
   |
   | API token from the Mixpanel dashboard
   |
   |
   */
  apiToken: Env.get('MIXPANEL_API_TOKEN'),

  /*
   |--------------------------------------------------------------------------
   | API Key
   |--------------------------------------------------------------------------
   |
   | API key from the Mixpanel dashboard
   |
   |
   */
  apiKey: Env.get('MIXPANEL_API_KEY'),

  /*
   |--------------------------------------------------------------------------
   | API Secret
   |--------------------------------------------------------------------------
   |
   | API secret from your Mixpanel dashboard
   |
   |
   */
  apiSecret: Env.get('MIXPANEL_API_SECRET'),

  /*
   |---------------------------------------------------------------------------
   | Distinct ID Name Key
   |---------------------------------------------------------------------------
   |
   | The property name on the `auth.user` object which is to be used as the
   | Mixpanel distint_id value for the user being tracked
   |
   | `auth.user['id']`
   */
  distinctIdNameKey: 'id',

  /*
   |---------------------------------------------------------------------------
   | Alias Name Key
   |---------------------------------------------------------------------------
   |
   | The property name on the `auth.user` object which is to be used as the
   | Mixpanel alias value for the user being tracked
   |
   | `auth.user['username']`
   */
  aliasNameKey: 'username',

  /*
   |---------------------------------------------------------------------------
   | Track IP Address
   |---------------------------------------------------------------------------
   |
   | Whether or not the IP address of the client (usually forwarded by a proxy)
   | is to be used to track geolocation info
   |
   |
   */
  trackIP: false,

  /*
   |---------------------------------------------------------------------------
   | Allowed Environment(s)
   |---------------------------------------------------------------------------
   |
   | The software application environment(s) where Mixpanel tracking is allowed
   |
   |
   |
   */
  allowedEnvs: ['production']

}
