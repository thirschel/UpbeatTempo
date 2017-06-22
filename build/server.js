'use strict'
const fs = require('fs')
var querystring = require('querystring')
const path = require('path')
const chalk = require('chalk')
const express = require('express')
const webpack = require('webpack')
const webpackConfig = require('./webpack.dev')
const config = require('./config')
const LogPlugin = require('./log-plugin')
const router = express.Router()
var request = require('request')
var jwt = require('jsonwebtoken');
const app = express();
var authConfig = require('../client/auth/auth0-variables');


router.get('/bitbucket/authenticate', function (req, res) {
  res.redirect(`https://bitbucket.org/site/oauth2/authorize?client_id=${authConfig.DEV_AUTH_CONFIG.clientId}&response_type=code&redirect_uri=${authConfig.DEV_AUTH_CONFIG.callbackUrl}`)
})

router.get('/bitbucket/callback', function (req, res) {
    var headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }

    var options = {
      url: 'https://bitbucket.org/site/oauth2/access_token',
      method: 'POST',
      headers: headers,
      form: {
        'client_id': authConfig.DEV_AUTH_CONFIG.clientId,
        'client_secret': authConfig.DEV_AUTH_CONFIG.clientSecret,
        'grant_type': 'authorization_code',
        'code': req.query.code,
        'redirect_uri': authConfig.DEV_AUTH_CONFIG.callbackUrl
      }
    }

    request(options, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var token = jwt.sign(body, authConfig.DEV_AUTH_CONFIG.clientSecret)
        res.redirect(`/callback?access_token=${token}`)
      }
    })
  }
)

router.get('/bitbucket/refresh', function (req, res) {
    var headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }

    var options = {
      url: 'https://bitbucket.org/site/oauth2/access_token',
      method: 'POST',
      headers: headers,
      form: {
        'client_id': authConfig.DEV_AUTH_CONFIG.clientId,
        'client_secret': authConfig.DEV_AUTH_CONFIG.clientSecret,
        'grant_type': 'refresh_token',
        'refresh_token': req.query.refresh_token
      }
    }

    request(options, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        res.json(JSON.parse(body))
      }
    })
  }
)

const port = config.port
webpackConfig.entry.client = [
  `webpack-hot-middleware/client?reload=true`,
  webpackConfig.entry.client
]

webpackConfig.plugins.push(new LogPlugin(port))

let compiler

try {
  compiler = webpack(webpackConfig)
} catch (err) {
  console.log(err.message)
  process.exit(1)
}

const devMiddleWare = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})
app.use(router)
app.use(devMiddleWare)
app.use(require('webpack-hot-middleware')(compiler, {
  log: () => {
  }
}))

const mfs = devMiddleWare.fileSystem
const file = path.join(webpackConfig.output.path, 'index.html')

devMiddleWare.waitUntilValid()

app.get('*', (req, res) => {
  devMiddleWare.waitUntilValid(() => {
    const html = mfs.readFileSync(file)
    res.end(html)
  })
})

app.listen(port)
