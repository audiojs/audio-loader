/* global XMLHttpRequest */
'use strict'

// Wrap a XMLHttpRequest into a Promise
module.exports = function (url, type) {
  return new Promise(function (done, reject) {
    var req = new XMLHttpRequest()
    if (type) req.responseType = type
    req.open('GET', url)

    req.onload = function () {
      if (req.status === 200) {
        done(req.response)
      } else {
        reject(Error(req.statusText))
      }
    }
    req.onerror = function () {
      reject(Error('Network Error'))
    }
    req.send()
  })
}
