{
  "name": "shopify-node-app",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "prod": "yarn run clean && yarn run build && cross-env NODE_ENV=production yarn run start",
    "dev": "cross-env NODE_ENV=development yarn run start",
    "start": "nodemon ./bin/www",
    "build": "cross-env NODE_ENV=production webpack --config ./config/webpack.config.js --progress --profile --colors",
    "clean": "rm -rf ./assets && mkdir ./assets",
    "pretty": "prettier --single-quote --trailing-comma es5 --write {client,bin,config,server}{/*,/**/*}.js",
    "precommit": "yarn run pretty"
  },
  "engines": {
    "node": ">= 8.9.1"
  },
  "browsers": [
    "last 3 chrome versions",
    "last 3 firefox versions",
    "last 2 versions",
    "safari >= 8",
    "ios >= 8",
    "ie >= 11",
    "explorermobile >= 11",
    "android >= 4.4"
  ],
  "dependencies": {
    "@shopify/polaris": "^2.3.1",
    "@shopify/shopify-express": "^1.0.0-alpha.7",
    "bluebird": "^3.5.2",
    "chalk": "^1.1.3",
    "connect-redis": "^3.3.0",
    "cross-env": "^5.1.3",
    "debug": "~2.6.3",
    "dotenv": "^4.0.0",
    "ejs": "~2.5.6",
    "es6-promise-pool": "^2.5.0",
    "express": "~4.15.2",
    "express-session": "^1.15.3",
    "isomorphic-fetch": "^2.2.1",
    "knex": "^0.13.0",
    "morgan": "~1.8.1",
    "nodemon": "^1.17.1",
    "react": "^16.4.0",
    "react-dom": "^16.4.0",
    "react-object-inspector": "^0.2.1",
    "react-redux": "^5.0.5",
    "redis": "^2.7.1",
    "redux": "^3.6.0",
    "redux-logger": "^3.0.6",
    "redux-thunk": "^2.2.0",
    "shopify-api-node": "^2.11.0",
    "sqlite3": "^3.1.9",
    "tiny-async-pool": "^1.0.1",
    "url": "^0.11.0",
    "webpack-hot-middleware": "^2.18.0",
    "webpack-middleware": "^1.5.1"
  },
  "devDependencies": {
    "autoprefixer": "^7.1.1",
    "babel-core": "^6.25.0",
    "babel-loader": "^7.0.0",
    "babel-plugin-transform-object-rest-spread": "^6.23.0",
    "babel-plugin-transform-class-properties": "^6.24.1",
    "babel-preset-env": "^1.5.2",
    "babel-preset-es2015": "^6.24.1",
    "babel-preset-react": "^6.24.1",
    "css-loader": "^0.28.4",
    "eslint": "3.19.0",
    "eslint-plugin-prettier": "^2.1.2",
    "global": "^4.3.2",
    "postcss-loader": "^2.0.6",
    "prettier": "^1.5.2",
    "react-hot-loader": "^3.0.0-beta.7",
    "style-loader": "^0.18.2",
    "webpack": "^2.6.1",
    "webpack-dev-server": "^2.4.5"
  }
}



## Deprecation of `shopify-express`

:exclamation: **This project is currently based on deprecated technology** (the `shopify-express` module). We will be updating it to use tools more inline with our internal node applications shortly.

In the meantime if you would like a headstart learning some of our other tools, [this workshop](https://github.com/Shopify/unite-react-node-app-workshop/blob/master/workshop.md) can help you get started. You can also jump straight to the final `step7` branch to have a reasonable starting place to build an app from. Note that it is not, however, meant to be a production ready app boilerplate.

If you would like to go straight to the source, many of our application libraries can be found in the [quilt](https://github.com/Shopify/quilt) repo. These are all used internally and written against technologies we use for our own applications. Some handy libraries for node apps you may want to look at are:
* [@shopify/koa-shopify-auth](https://github.com/Shopify/quilt/tree/master/packages/koa-shopify-auth)
* [@shopify/koa-shopify-graphql-proxy](https://github.com/Shopify/quilt/blob/master/packages/koa-shopify-graphql-proxy/README.md)
* [@shopify/react-html](https://github.com/Shopify/quilt/blob/master/packages/react-html/README.md)

Finally, as mentioned above we have some new things coming down the pipe soon. ❤️✨

# Shopify Node App

The goal of this example app is to provide a starting point for Shopify app developers so that they will be able to quickly
spin up an embedded Shopify app using Node and Express.js and get started using the Polaris design system and React components.

This example app uses Node, Express, Webpack, React, Redux, and Shopify/polaris

## Features
- [x] React app using [Polaris](https://polaris.shopify.com/)
- [x] Shopify Authentication
- [x] Get API data from Shopify and pass it to React
- [x] Hot reloading with Webpack
- [x] Example data flow with Redux and Polaris React components
- [x] Example webhook set up

## Commands
- `yarn run start` run the server
- `yarn run dev` run it in development mode with hotreloading
- `yarn run prod` run it in production mode with compiled assets
- `yarn run clean` clean the compiled assets directory

## Running the project locally

### Install project dependencies
- Install Node.js version 8.1.0 or higher. We recommend using [nvm](https://github.com/creationix/nvm) to manage Node versions.
- Install the [Yarn.js](https://yarnpkg.com/en/docs/install) package manager. Yarn is an alternative to npm that is faster and more reliable.
- Install project dependencies with `yarn install`

### Allow your app to talk to Shopify
- Create a tunnel to localhost:3000 using [forward](https://forwardhq.com/) or [ngrok](https://ngrok.com/)
  - Note the tunnel url (we’ll refer to it as `HOST`)

### Register your app in the Partner Dashboard
- Sign into your [Shopify Partner Dashboard](https://partners.shopify.com/organizations)
- Click 'Apps' in the sidebar and create a new app
- Set the app url to `{{ HOST }}/`
- Set the whitelisted URL to `{{ HOST }}/shopify/auth/callback`
- Go to extensions tab and enable “Embed in Shopify admin”

### Configure and add to a store
- Rename `.env.example` to `.env` and
  - Set Add HOST from your tunnel service as `SHOPIFY_APP_HOST`
  - Add the api key from partners dash as `SHOPIFY_APP_KEY`
  - Add the api secret from partners dash as `SHOPIFY_APP_SECRET`
- Run `yarn install && yarn run start`
- Open a browser to `{{ HOST }}/install`
- Enter your store’s domain and hit install
- 🚀 🎉

## Architecture

There are three main sections that provide the foundations for this example. They are organized as follows:

### `server`
This folder provides the Express.js server as well as a few basic views.
The server provides some example endpoints that demonstrate mounting the Shopify routes for installation and authentication, hosting the React app
with an API proxy, and a basic webhook.

The code here is mostly glue code, with the bulk of the actual functionality provided by the modules in `shopify-express`.

### `shopify-express`
This example app consumes the [shopify-express](https://github.com/shopify/shopify-express-app) library to quickly connect to the Shopify API.

### `shopify-api-node`
This example app uses the Official [shopify-api-node](https://github.com/MONEI/Shopify-api-node) library to connect to the Shopify API.

### `client`
This folder contains the UI demo using Polaris React components and Redux to manage app state.
It has two subfolders called `store` and `actions` which are Redux concepts.

`store` is the thing that models the state of the app. Every Redux action sends a message to a function called a 'reducer'.
The reducer uses the information in the message to progress the state of the app.
For simplicity, we included the reducer in the same file as the store configuration.

`actions` are the functions that are fired from interactions with the UI.
