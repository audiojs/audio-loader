/* global describe it */
var assert = require('assert')
var isBuffer = require('is-audio-buffer')
var load = require('..')
var wavBuffer = require('audio-lena/wav')
var mp3Buffer = require('audio-lena/mp3')
var rawBuffer = require('audio-lena/buffer')
var t = require('tape')
var path = require('path')

function testBuffer (buffer) {
  assert(buffer, 'buffer is present')
  assert(isBuffer(buffer), 'buffer is a buffer')
  return buffer
}

t('load wav buffer', function (t) {
  load(wavBuffer).then(testBuffer).then(() => t.end(), () => t.fail())
})
t('load mp3 buffer', function (t) {
  load(mp3Buffer).then(testBuffer).then(() => t.end(), () => t.fail())
})
t('load wav files', function (t) {
  load('./example/samples/maeclave.wav').then(testBuffer).then(() => t.end(), () => t.fail())
})
t('should throw error on undecodable data', function (t) {
  load(rawBuffer).then(testBuffer => {
    t.fail()
  }, e => {
    t.ok(e)
    t.end()
  })
})
t('load mp3 files', function (t) {
  load('./example/samples/train.mp3').then(testBuffer).then(() => t.end(), () => t.fail())
})
t('load absolute paths', function (t) {
  load(path.resolve('./example/samples/train.mp3')).then(testBuffer).then(() => t.end(), () => t.fail())
})
t('load remote files', function (t) {
  load('https://ia802508.us.archive.org/5/items/testmp3testfile/mpthreetest.mp3')
  .then(testBuffer).then(() => t.end(), (e) => t.fail(e))
})
