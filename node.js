var fs = require('fs')
var decodeAudio = require('audio-decode')
var request = require('request')
var loader = require('.')

module.exports = function load (path, options) {
  var opts = Object.assign({ decode: decodeAudio }, options)
  return loader(null, path, opts)
}

loader.fetch = function (url, type) {
  return (isPath(url) ? readFile(url) : sendRequest(url, type)).then(decodeAudio)
}

function isPath (url) { return /^[\\\/\.]/.test(url) }

function readFile (url) {
  return new Promise(function (done, reject) {
    fs.readFile(url, function (err, data) {
      err ? reject(err) : done(data)
    })
  })
}
function sendRequest (url, type) {
  return new Promise(function (done, reject) {
    request({ url: url, responseType: 'arraybuffer' }, function (err, resp, body) {
      if (err) reject(err)
      else if (resp.statusCode !== 200) reject('Status code: ' + resp.statusCode)
      else done(body)
    })
  })
}
