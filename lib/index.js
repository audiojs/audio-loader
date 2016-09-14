'use strict'
var fs = require('fs')
var decode = require('audio-decode')
var request = require('request')
var load = require('./load')

/**
 * Load audio
 */
module.exports = function (path, options) {
  var opts = Object.assign({ decode: decode, fetch: fetch }, options)
  return load(path, opts)
}

function isPath (url) { return /^[\\\/\.]/.test(url) }
function fetch (url, type) {
  return isPath(url) ? readFile(url) : sendRequest(url, type)
}

function readFile (url) {
  return new Promise(function (done, reject) {
    fs.readFile(url, function (err, data) {
      err ? reject(err) : done(data.buffer)
    })
  })
}

function sendRequest (url, type) {
  var encoding = type === 'arraybuffer' ? null : 'utf8'
  return new Promise(function (done, reject) {
    request({ url: url, encoding: encoding }, function (err, resp, body) {
      if (err) reject(err)
      else if (resp.statusCode !== 200) reject('Status code: ' + resp.statusCode)
      else done(body)
    })
  })
}
