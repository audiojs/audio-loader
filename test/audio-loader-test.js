/* global describe it */
var fs = require('fs')
var assert = require('assert')
var utils = require('./support/utils')
var load = require('..')
var ac = utils.audioContext
var fetcher = utils.fetcher
var pianoSF = fs.readFileSync(__dirname + '/support/piano.js').toString()

describe('audio-loader', function () {
  describe('Promises support', function () {
    it('always returns a promise', function () {
      var p = load(ac, utils.strToArrayBuffer('data'))
      assert(p)
      assert.equal(typeof p.then, 'function')
    })
    it('if pass a promise as argument, resolve it first', function () {

    })
  })
  describe('Invalid parameters', function () {
    it('rejects nulls', function (done) {
      load(ac, null).then(function () {
        assert(false, 'Should throw an error')
      }).catch(function (err) { assert(err); done() })
    })
  })
  describe('Loads ArrayBuffer', function () {
    it('loads ArrayBuffer', function () {
      return load(ac, utils.strToArrayBuffer('audio data')).then(function (data) {
        assert.equal(data, 'audio data')
      })
    })
  })
  describe('Load audio file names', function () {
    it('mp3', function () {
      load.fetch = fetcher({ 'audio.mp3': 'mp3 data' })
      return load(ac, 'audio.mp3').then(function (data) {
        assert.equal(data, 'mp3 data')
      })
    })
    it('ogg', function () {
      load.fetch = fetcher({ 'audio.ogg': 'ogg data' })
      return load(ac, 'audio.ogg').then(function (data) {
        assert.equal(data, 'ogg data')
      })
    })
    it('wav', function () {
      load.fetch = fetcher({ 'audio.ogg': 'ogg data' })
      return load(ac, 'audio.ogg').then(function (data) {
        assert.equal(data, 'ogg data')
      })
    })
    it('options.from', function () {
      load.fetch = fetcher({ 'server.com/audio.mp3': 'mp3 data' })
      return load(ac, 'audio.mp3', {from: 'server.com/'}).then(function (data) {
        assert.equal(data, 'mp3 data')
      })
    })
  })
  describe('Load data arrays', function () {
    it('multiple file names', function () {
      load.fetch = fetcher({
        'server.com/file1.mp3': 'file1 audio data',
        'server.com/file2.mp3': 'file2 audio data'
      })
      return load(ac, ['file1.mp3', 'file2.mp3'], { from: 'server.com/' })
        .then(function (result) {
          assert.deepEqual(result, [ 'file1 audio data', 'file2 audio data' ])
        })
    })
    it('bypasses audio files', function () {
      load.fetch = fetcher({ 'file1.mp3': 'file audio data' })
      return load(ac, ['file1.mp3', 'copyright notice']).then(function (result) {
        assert.deepEqual(result, [ 'file audio data', 'copyright notice' ])
      })
    })
  })
  describe('Load data objects', function () {
    it('bypassed not audio files', function () {
      load.fetch = fetcher({
        'server.com/file1.mp3': 'file1 audio data',
        'server.com/file2.mp3': 'file2 audio data'
      })
      return load(ac, { one: 'file1.mp3', two: 'file2.mp3', total: 2 },
      { from: 'server.com/' }).then(function (result) {
        assert.deepEqual(result,
          { total: 2, one: 'file1 audio data', two: 'file2 audio data' })
      })
    })
    it('options.only', function () {
      load.fetch = fetcher({
        'server.com/file2.mp3': 'file2 audio data'
      })
      return load(ac, { one: 'file1.mp3', two: 'file2.mp3', total: 2 },
      { from: 'server.com/', only: ['two'] }).then(function (result) {
        assert.deepEqual(result,
          { two: 'file2 audio data' })
      })
    })
  })
  describe('Loads Audio in Base64 format', function () {
    it('simple data', function () {
      return load(ac, utils.strToBase64Audio('audio data')).then(function (result) {
        assert.equal(result, 'audio data')
      })
    })
    it('object', function () {
      var object = {
        file1: utils.strToBase64Audio('file1 audio data'),
        file2: utils.strToBase64Audio('file1 audio data')
      }
      return load(ac, object).then(function (data) {
        assert.deepEqual(data,
          { file1: 'file1 audio data', file2: 'file1 audio data' })
      })
    })
  })
  describe('Load JSON files', function () {
    it('an object of audio file names', function () {
      var json = '{ "snare": "audio/snare.mp3", "kick": "audio/kick.mp3" }'
      load.fetch = fetcher({
        'server.com/audio/snare.mp3': 'snare audio data',
        'server.com/audio/kick.mp3': 'kick audio data',
        'server.com/file.json?data=true': json
      })
      return load(ac, 'file.json?data=true', { from: 'server.com/' }).then(function (data) {
        assert.deepEqual(data,
          { snare: 'snare audio data', kick: 'kick audio data' })
      })
    })
  })
  describe('Load MIDI.js Soundfont js pre-rendered files', function () {
    it('loads data file', function () {
      load.fetch = fetcher({ 'piano.js?data=true': pianoSF })
      return load(ac, 'piano.js?data=true').then(function (data) {
        assert.deepEqual(data,
          { A0: 'audio', Bb0: 'audio', B0: 'audio',
            C1: 'audio', Db1: 'audio' })
      })
    })
    it('options.from', function () {
      load.fetch = fetcher({ 'server.com/piano.js?audio=true': pianoSF })
      function toUrl (name) { return 'server.com/' + name + '?audio=true' }
      return load(ac, 'piano.js', { from: toUrl }).then(function (data) {
        assert.deepEqual(data,
          { A0: 'audio', Bb0: 'audio', B0: 'audio',
            C1: 'audio', Db1: 'audio' })
      })
    })
  })
})
