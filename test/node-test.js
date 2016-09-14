/* global describe it */
var assert = require('assert')
var load = require('..')

function testBuffer (buffer) {
  assert(buffer, 'buffer is present')
  assert(buffer instanceof Buffer, 'buffer is a buffer')
  return buffer
}

describe('audio-loader@node', function () {
  it.skip('load wav files', function () {
    return load('./example/samples/blip.wav').then(testBuffer)
  })
  it.skip('load mp3 files', function () {
    return load('./example/samples/drumroll.mp3').then(testBuffer)
  })
})
