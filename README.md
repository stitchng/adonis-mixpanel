# adonis-mixpanel

An addon/plugin package to provide Mixpanel data collection and tracking services in AdonisJS 4.0+

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coveralls][coveralls-image]][coveralls-url]

<img src="http://res.cloudinary.com/adonisjs/image/upload/q_100/v1497112678/adonis-purple_pzkmzt.svg" width="200px" align="right" hspace="30px" vspace="140px">

## Getting Started

>Install from the NPM Registry - (Please read the **instructions.md** file to learn how to setup this package properly).

```bash

   $ adonis install adonisjs-mixpanel

```

## Usage

>Import and use in controllers or the standard **AdonisJS Event Bus**

```js

const mixpanel = use('MixPanel')
const User = use('App/Models/User')

class UserController {

    async fetch({ request, response }){

        let allUsers = await User.all()

        return response.status(200).json({
            users:allUsers
        });
    }

    async register({ request, response }) {

        let user_details = request.only([
            'dob',
            'email',
            'phone',
            'first_name',
            'last_name'
        ])

        let newUser = await User.create(user_details)

        // track a new user registered to the web OR mobile app
        mixpanel.trackUserBasicAttributes(
            newUser.toJSON()
        );

        return response.status(201).json({
            message:'User Created!',
            user: newUSer.toJSON()
        });
    }
}

module.exports = UserController

```

>More examples

```js

const mixpanel = use('MixPanel')
const User = use('App/Models/User')

class BillingController {

    async payment({ request, response }){

        let user = await User.findBy('id', 1)

        // track the charge made on a user for using the web OR mobile app
        // which ties to revenue from the user for the app
        mixpanel.trackUserBillingCharge(
            user,
            40000 // Naira
        )
    }
}

module.exports = BillingController

```

>This library can also be used to track events using the `mixtrack` named middleware.

```js

const Route = use('Route')

Route.group(() => {
  Route.get('/all', 'UserController.fetch')
  Route.put('/update/email', function({ auth, request, response }) {
    const user = await auth.getUser()
    user.merge({
      email: request.input('email', null)
    })

    await user.save() // send to database
    await user.reload() // refresh with new email

    request.user = user.toJSON()
    return response.status(200).send('User Updated Email!')
  }).middleware (
    ['auth', 'mixtrack: set;email']
  ) // track updated data for user via 'email'
})
.prefix('user')

```

## License

MIT

## Running Tests
```bash

    npm i

```

```bash

    npm run lint

    npm run test

```

## Credits

- [Ifeora Okechukwu](https://twitter.com/isocroft)
    
## Contributing

See the [CONTRIBUTING.md](https://github.com/stitchng/adonis-mixpanel/blob/master/CONTRIBUTING.md) file for info

[npm-image]: https://img.shields.io/npm/v/adonisjs-mixpanel.svg?style=flat-square
[npm-url]: https://npmjs.org/package/adonisjs-mixpanel

[travis-image]: https://img.shields.io/travis/stitchng/adonis-mixpanel/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/stitchng/adonis-mixpanel

[coveralls-image]: https://img.shields.io/coveralls/stitchng/adonis-mixpanel/master.svg?style=flat-square

[coveralls-url]: https://coveralls.io/github/stitchng/adonis-mixpanel

## Support 

**Coolcodes** is a non-profit software foundation (collective) created by **Oparand** - parent company of StitchNG, Synergixe based in Abuja, Nigeria. You'll find an overview of all our work and supported open source projects on our [Facebook Page](https://www.facebook.com/coolcodes/).

>Follow us on facebook if you can to get the latest open source software/freeware news and infomation.

Does your business depend on our open projects? Reach out and support us on [Patreon](https://www.patreon.com/coolcodes/). All pledges will be dedicated to allocating workforce on maintenance and new awesome stuff.
