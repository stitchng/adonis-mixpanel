## Registering provider

Like any other provider, you need to register the provider inside `start/app.js` file.

```js
const providers = [
  'adonisjs-mixpanel/providers/MixPanelProvider'
]
```

## Registering middleware

Register this middleware as a **global** middleware inside the `start/kernel.js` file. Place it after the `Adonis/Middleware/AuthInit` middleware

```js
const globalMiddleware = [
  'Adonis/Middleware/Session',
  ...
  'Adonis/Middleware/AuthInit',
  'Adonis/Middleware/MixPanelHttpTracker' // optional
]
```

Register this middleware as a **named** middleware inside the `start/kernel.js` file.

```js
const namedMiddleware = {
  mixtrack:'Adonis/Middleware/MixPanelUserPropsTracker'
}
```

## Usage

Use as follows in `start/routes.js` file

```js

const Route = use('Route')
const Mixpanel = use('MixPanel')

Route.group(() => {
  Route.get('/home', function({ auth, request, view }) {
    const user = auth.user || { toJSON: () => null }
    // Track the web page the user/unknown guest visited
    Mixpanel.trackUserEvent(
      'page_visited',
      { time: new Date(), ip: request.ip(), url: '/home' }
    )

    // Return a HTML view for the website's home page
    return view.render(
      'website.home',
      { user: user.toJSON() }
    )
  }).middleware(
    [
      'auth',
      // Track all cookies for the site via `set_once` directive
      // Track the number times a user/unknwon guest visited the home page via `increment`
      'mixtrack:set_once;|cookies.all,increment;visit_to_home_page'
    ]
  )
}).prefix('user')

```

## Config

The configuration for this package is saved inside `config/mixpanel.js` file. Tweak it according to your preferences.

## Docs

To find out more, read the docs [here](https://github.com/stitchng/adonis-mixpanel).
