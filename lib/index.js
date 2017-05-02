'use strict'
var fs = require('fs')
var decode = require('audio-decode')
var request = require('request')
var load = require('./load')
var isRelative = require('is-relative')
var isAbsolute = require('is-absolute')
var isURL = require('is-url')
var extend = require('object-assign')

/**
 * Load audio
 */
module.exports = function (path, options, cb) {
  if (options instanceof Function) {
    cb = options
    options = {}
  }
  options = options || {}
  var opts = extend({ decode: decode, fetch: fetch }, options)
  if (!opts.ready) opts.ready = cb || function () {}
  return load(path, opts)
}

function isPath (url) {
  return isAbsolute(url) || (isRelative(url) && !isURL(url))
}
function fetch (url, type) {
  return isPath(url) ? readFile(url) : sendRequest(url, type)
}

function readFile (url) {
  return new Promise(function (resolve, reject) {
    fs.readFile(url, function (err, data) {
      err ? reject(err) : resolve(data.buffer)
    })
  })
}

function sendRequest (url, type) {
  var encoding = type === 'arraybuffer' ? null : 'utf8'
  return new Promise(function (resolve, reject) {
    request({ url: url, encoding: encoding }, function (err, resp, body) {
      if (err) reject(err)
      else if (resp.statusCode !== 200) reject('Status code: ' + resp.statusCode)
      else resolve(body)
    })
  })
}
