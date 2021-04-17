# RHUE: react-hooks-uikit-express-oauth-boiler-v2

[![Status](https://travis-ci.org/scharkee/react-hooks-uikit-express-oauth-boiler-v2.svg?branch=master)](https://travis-ci.org/scharkee/react-hooks-uikit-express-oauth-boiler-v2)

A React TypeScript boilerplate utilizing React hooks, using Express as backend, UIKit for frontend, MongoDB for storage & [open-authenticator](https://github.com/Scharkee/open-authenticator) for oauth.

[Demo website.](https://reacthooks.demos.matasr.com)

---

## Features

- Webpack+Babel for the client
- Full TypeScript support for server and client
- User authentication:
  - email/password (basic/lightweight mode)
  - via [open-authenticator](https://github.com/Scharkee/open-authenticator)(Google, Twitter, LinkedIn, etc.).
- Auth method merging, linking and unlinking of social accounts. (Only if using open-authenticator).
- Client
  - React, backed by UIKit components/layout/icons
  - React hooks for state management
  - Mocked auth-gated data example
  - Dynamic UI elements that generate from with open-authenticator, based on your config
- Server
  - Express server
  - Async/await design with await-to-js error handling
  - MongoDB for storage, via mongoose.
  - Auth-based route guarding
- TLS/HTTPS:
  - Automatic certificate generation if running composition
  - Simple/dev mode (http only, custom port), for use with reverse proxy configurations or for basic http operation.

---

## Running in basic mode

```bash
# clone the repository
$ git clone https://github.com/Scharkee/react-hooks-uikit-express-oauth-boiler-v2.git

# switch to the folder
$ cd react-hooks-uikit-express-oauth-boiler-v2

# install dependencies. If you would rather use npm, try npm i. npm run SCRIPT for things below.
$ yarn

# perform guided setup
$ yarn setup

# build the client and launch everything in devmode on port 8080.
$ yarn dev

# launch in production mode on the port that was chosen when setting up (default 80)
$ yarn launch

```

---

## Running in composition mode (OAuth-ready)

This takes care of the database, routing, HTTPS certificate generation, and OAuth for you.

Make sure to use `mongodb://mongo:27017/boiler` as the mongooseConnectionString in the config, if you're running in composition mode.

```bash
# clone the repo
$ git clone https://github.com/Scharkee/react-hooks-uikit-express-oauth-boiler-v2.git

# switch to the folder
$ cd react-hooks-uikit-express-oauth-boiler-v2

# perform configuration
$ yarn && yarn setup

# launch!
$ docker-compose up

# At this point you can access everything through your domain,
# as long as it is properly pointed towards your IP.
# However, you will not see any OAuth options yet at the login or profile.

```

---

## Enabling OAuth logins

In order to enable OAuth logins, run:

```bash
# Configure your OAuth strategies (configure open-authenticator):
$ docker exec -it authenticator yarn setup

# After you are happy with the configurations restart the container.
# The config will be persisted locally in config/open-authenticator.
$ docker restart authenticator

# Upon restarting, open-authenticator will automatically install all required dependencies.
# You are good to go!

```

---

### Domain setup

If running in composition mode, you must have two domains pointed to your IP:

- One for the boilerplate (e.g. boilerplate.yourdomain.com)
- One for open-authenticator (e.g. auth.yourdomain.com)

The HTTPS certificates will be generated for you when you run the composition, as long as these domains are indeed pointed to the machine you are running it on.

### open-authenticator instance for testing

If you would like to test everything out, but can not set up open-authenticator for one or more reasons, you can use this instance:

```json

"client" : "boiler_C22nynzEB7S3gKCCSzaDKuFX"
"url": "https://auth.ensio.hefa.lt"

```

This open-authenticator instance contains strategies for Google, Twitter and GitHub.

**Do not** use this in production, since this client will be removed after some time, and it may not always be online.

### Information & sources

Check out open-authenticator: [open-authenticator GitHub](https://github.com/Scharkee/open-authenticator)

React docs can be found here: [React docs.](https://reactjs.org/docs/getting-started.html)

Read about React Hooks [here](https://reactjs.org/docs/hooks-intro.html)

Read about UIKit [here](https://getuikit.com/docs/introduction)

### Contribution & Support

Submit bugs and requests through the project's issue tracker. You are also very welcome to contribute :)

[![Issues](http://img.shields.io/github/issues/Scharkee/react-hooks-uikit-express-oauth-boiler-v2.svg)](https://github.com/Scharkee/react-hooks-uikit-express-oauth-boiler-v2/issues)

### License

This project is licensed under the terms of the MIT license.
