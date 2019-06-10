## Registering provider

Like any other provider, you need to register the provider inside `start/app.js` file.

```js
const providers = [
  'adonisjs-mixpanel/providers/MixPanelProvider'
]
```

## Registering middleware

Register the following middleware inside `start/kernel.js` file. Place the bugsnag middleware after the 'Adonis/Middleware/AuthInit' middleware

```js
const namedMiddleware = {
  mixtrack:'Adonis/Middleware/MixPanelUserTracker'
}
```

## Config

The configuration is saved inside `config/mixpanel.js` file. Tweak it accordingly.

## Docs

To find out more, read the docs [here](https://github.com/stitchng/adonis-mixpanel).
