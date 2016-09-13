var fs = require('fs')
var decodeAudio = require('audio-decode')
var request = require('request')
var loader = require('.')

// A fix to audio-decode module
function decode (buffer) {
  if (buffer instanceof ArrayBuffer) buffer = Buffer(buffer)
  return decodeAudio(buffer)
}

module.exports = function load (path, options) {
  var opts = Object.assign({ decode: decode }, options)
  return loader(null, path, opts)
}

loader.fetch = function (url, type) {
  return isPath(url) ? readFile(url) : sendRequest(url, type)
}

function isPath (url) { return /^[\\\/\.]/.test(url) }

function readFile (url) {
  return new Promise(function (done, reject) {
    fs.readFile(url, function (err, data) {
      console.log('JODER"', data.toString().slice(0, 10))
      err ? reject(err) : done(data)
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
