/* global XMLHttpRequest */
'use strict'
var load = require('./load')
var context = require('audio-context')

module.exports = function (source, options, cb) {
  if (options instanceof Function) {
    cb = options
    options = {}
  }
  options = options || {}
  options.ready = cb || function () {}
  var ac = options && options.context ? options.context : context()
  var defaults = { decode: getAudioDecoder(ac), fetch: fetch }
  var opts = Object.assign(defaults, options)
  return load(source, opts)
}

/**
 * Wraps AudioContext's decodeAudio into a Promise
 */
function getAudioDecoder (ac) {
  return function decode (buffer) {
    return new Promise(function (resolve, reject) {
      ac.decodeAudioData(buffer,
        function (data) { resolve(data) },
        function (err) { reject(err) })
    })
  }
}

/*
 * Wraps a XMLHttpRequest into a Promise
 *
 * @param {String} url
 * @param {String} type - can be 'text' or 'arraybuffer'
 * @return {Promise}
 */
function fetch (url, type) {
  return new Promise(function (resolve, reject) {
    var req = new XMLHttpRequest()
    if (type) req.responseType = type

    req.open('GET', url)
    req.onload = function () {
      req.status === 200 ? resolve(req.response) : reject(Error(req.statusText))
    }
    req.onerror = function () { reject(Error('Network Error')) }
    req.send()
  })
}
