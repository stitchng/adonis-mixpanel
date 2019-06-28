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
  'Adonis/Middleware/MixPanelHttpTracker'
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

Route.group(() => {
  Route.put('/login', function({ request, response }){
    return response.send('User Logged In!')
  })
}).prefix('user').middleware(['mixtrack:user_login;email'])

```

## Config

The configuration is saved inside `config/mixpanel.js` file. Tweak it accordingly.

## Docs

To find out more, read the docs [here](https://github.com/stitchng/adonis-mixpanel).
