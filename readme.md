# react-redux-passport-uikit-express-boiler

[![Status](https://travis-ci.org/scharkee/react-redux-passport-uikit-express-boiler.svg?branch=master)](https://travis-ci.org/scharkee/react-redux-passport-uikit-express-boiler)

A React+Redux boilerplate using Express as backend, UIKit for frontend, MongoDB for storage & Passport for auth.

[Demo website.](https://reactredux.demos.matasr.com)

## Features

- Webpack+Babel for the client, babel-node for the server
- User authentication either via email/password or via Google/Twitter. PassportJS allows for easy expansion to authentication via other social platforms.
- Auth method merging, linking and unlinking of social auth accounts
- Client
  - React, backed by UIKit components/layout/icons
  - Redux + Redux-saga state management
  - Mocked auth-gated data example
  - redux-devtools and redux-logger automatically enabled in devmode for testing purposes
- Server
  - Express server
  - Async/await design with await-to-js error handling
  - MongoDB(mongoose) for storage
  - Auth-based route guarding
- TLS/HTTPS:
  - Automatic certificate generation powered by greenlock
  - Self hosted mode (443/80 port access required) + simple mode (http only, custom port), for use with reverse proxy configurations

## Installation

```bash

# clone the repo
$ git clone https://github.com/Scharkee/react-redux-passport-uikit-express-boiler.git
$ cd react-redux-passport-uikit-express-boiler
# install dependencies
$ npm i
# perform guided setup
$ npm run setup
# build the client and launch everything in devmode on port 8081.
$ npm run dev

# launch in production mode on the port that was chosen when setting up (default 7777)
$ npm run launch

```

## TODO

- Full coverage tests.

### Unguided key setup

- The process for obtaining a Google key is described [here](https://developers.google.com/identity/protocols/OAuth2).
- The process for obtaining a Twitter key is described [here](https://developer.twitter.com/en/docs/basics/authentication/guides/access-tokens.html).

### Information & sources

React docs can be found here: [React docs.](https://reactjs.org/docs/getting-started.html)

Read about Redux here [here](https://redux.js.org/introduction/getting-started) and about Redux-Saga [here.](https://redux-saga.js.org/)
