/* global describe it */
var assert = require('assert')
var isBuffer = require('is-audio-buffer')
var load = require('..')

function testBuffer (buffer) {
  assert(buffer, 'buffer is present')
  assert(isBuffer(buffer), 'buffer is a buffer')
  return buffer
}

describe('audio-loader@node', function () {
  it('load wav files', function () {
    return load('./example/samples/maeclave.wav').then(testBuffer)
  })
  it.skip('load mp3 files', function () {
    return load('./example/samples/drumroll.mp3').then(testBuffer)
  })
})
