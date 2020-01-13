'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  orc:'"/orc/"',
  api:'"/api/"',
  API_HOST:'""'
})
