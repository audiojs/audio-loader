/* global describe it */
var assert = require('assert')
var isBuffer = require('is-audio-buffer')
var load = require('..')
var wavBuffer = require('audio-lena/wav')
var mp3Buffer = require('audio-lena/mp3')

function testBuffer (buffer) {
  assert(buffer, 'buffer is present')
  assert(isBuffer(buffer), 'buffer is a buffer')
  return buffer
}

describe('audio-loader@node', function () {
  it('load wav buffer', function () {
    return load(wavBuffer).then(testBuffer)
  })
  it('load mp3 buffer', function () {
    return load(mp3Buffer).then(testBuffer)
  })
  it('load wav files', function () {
    return load('./example/samples/maeclave.wav').then(testBuffer)
  })
  it('load mp3 files', function () {
    return load('./example/samples/train.mp3').then(testBuffer)
  })
})
