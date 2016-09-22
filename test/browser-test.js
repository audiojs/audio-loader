/* global describe it */
var fs = require('fs')
var assert = require('assert')
var utils = require('./support/utils')
var load = require('../lib/browser')
var fetcher = utils.fetcher
var path = require('path')
var pianoSF = fs.readFileSync(path.join(__dirname, '/support/piano.js')).toString()

describe('audio-loader@browser:', function () {
  describe('Promises support', function () {
    it('always returns a promise', function () {
      var p = load(utils.strToArrayBuffer('data'))
      assert(p)
      assert.equal(typeof p.then, 'function')
    })
    it('if pass a promise as argument, resolve it first', function () {

    })
  })
  describe('Invalid parameters', function () {
    it('rejects nulls', function (done) {
      load(null).then(function () {
        assert(false, 'Should throw an error')
      }).catch(function (err) { assert(err); done() })
    })
  })
  describe('Buffers', function () {
    it('loads ArrayBuffer', function () {
      var buffer = utils.strToArrayBuffer('audio data')
      return load(buffer, { decode: utils.decode }).then(function (data) {
        assert.equal(data, 'audio data')
      })
    })
  })
  describe('Load audio file names', function () {
    it('mp3', function () {
      var opts = {
        fetch: fetcher({ 'audio.mp3': 'mp3 data' }),
        decode: utils.decode }
      return load('audio.mp3', opts).then(function (data) {
        assert.equal(data, 'mp3 data')
      })
    })
    it('ogg', function () {
      var opts = {
        fetch: fetcher({ 'audio.ogg': 'ogg data' }),
        decode: utils.decode }
      return load('audio.ogg', opts).then(function (data) {
        assert.equal(data, 'ogg data')
      })
    })
    it('wav', function () {
      var opts = {
        fetch: fetcher({ 'audio.wav': 'wav data' }),
        decode: utils.decode }
      return load('audio.wav', opts).then(function (data) {
        assert.equal(data, 'wav data')
      })
    })
    it('options.from', function () {
      var opts = {
        fetch: fetcher({ 'server.com/audio.mp3': 'mp3 data' }),
        decode: utils.decode,
        from: 'server.com/'
      }
      return load('audio.mp3', opts).then(function (data) {
        assert.equal(data, 'mp3 data')
      })
    })
  })
  describe('Load data arrays', function () {
    it('multiple file names', function () {
      var opts = {
        decode: utils.decode,
        fetch: fetcher({
          'server.com/file1.mp3': 'file1 audio data',
          'server.com/file2.mp3': 'file2 audio data'
        }),
        from: 'server.com/'
      }
      return load(['file1.mp3', 'file2.mp3'], opts)
        .then(function (result) {
          assert.deepEqual(result, [ 'file1 audio data', 'file2 audio data' ])
        })
    })
    it('non audio files not processed', function () {
      var opts = {
        decode: utils.decode,
        fetch: fetcher({ 'file1.mp3': 'file audio data' })
      }
      return load(['file1.mp3', 'copyright notice'], opts).then(function (result) {
        assert.deepEqual(result, [ 'file audio data', 'copyright notice' ])
      })
    })
  })
  describe('Load data objects', function () {
    it('bypassed not audio files', function () {
      var opts = {
        decode: utils.decode,
        fetch: fetcher({
          'server.com/file1.mp3': 'file1 audio data',
          'server.com/file2.mp3': 'file2 audio data'
        }),
        from: 'server.com/'
      }
      return load({ one: 'file1.mp3', two: 'file2.mp3', total: 2 }, opts)
      .then(function (result) {
        assert.deepEqual(result,
          { total: 2, one: 'file1 audio data', two: 'file2 audio data' })
      })
    })
    it('options.only', function () {
      var opts = {
        decode: utils.decode,
        fetch: fetcher({
          'server.com/file2.mp3': 'file2 audio data'
        }),
        from: 'server.com/',
        only: [ 'two' ]
      }
      return load({ one: 'file1.mp3', two: 'file2.mp3', total: 2 }, opts)
      .then(function (result) {
        assert.deepEqual(result,
          { two: 'file2 audio data' })
      })
    })
  })
  describe('Loads Audio in Base64 format', function () {
    it('simple data', function () {
      var opts = { decode: utils.decode }
      return load(utils.strToBase64Audio('audio data'), opts).then(function (result) {
        assert.equal(result, 'audio data')
      })
    })
    it('object', function () {
      var opts = { decode: utils.decode }
      var object = {
        file1: utils.strToBase64Audio('file1 audio data'),
        file2: utils.strToBase64Audio('file1 audio data')
      }
      return load(object, opts).then(function (data) {
        assert.deepEqual(data,
          { file1: 'file1 audio data', file2: 'file1 audio data' })
      })
    })
  })
  describe('Load JSON files', function () {
    it('an object of audio file names', function () {
      var json = '{ "snare": "audio/snare.mp3", "kick": "audio/kick.mp3" }'
      var opts = {
        decode: utils.decode,
        fetch: fetcher({
          'server.com/audio/snare.mp3': 'snare audio data',
          'server.com/audio/kick.mp3': 'kick audio data',
          'server.com/file.json?data=true': json
        }),
        from: 'server.com/'
      }
      return load('file.json?data=true', opts).then(function (data) {
        assert.deepEqual(data,
          { snare: 'snare audio data', kick: 'kick audio data' })
      })
    })
  })
  describe('Load MIDI.js Soundfont js pre-rendered files', function () {
    it('loads data file', function () {
      var opts = {
        decode: utils.decode,
        fetch: fetcher({ 'piano.js?data=true': pianoSF })
      }
      return load('piano.js?data=true', opts).then(function (data) {
        assert.deepEqual(data,
          { A0: 'audio', Bb0: 'audio', B0: 'audio', C1: 'audio', Db1: 'audio' })
      })
    })
    it('options.from with function', function () {
      var opts = {
        decode: utils.decode,
        fetch: fetcher({ 'server.com/piano.js?audio=true': pianoSF }),
        from: function toUrl (name) { return 'server.com/' + name + '?audio=true' }
      }
      return load('piano.js', opts).then(function (data) {
        assert.deepEqual(data,
          { A0: 'audio', Bb0: 'audio', B0: 'audio', C1: 'audio', Db1: 'audio' })
      })
    })
  })
})
