'use strict'

var base64 = require('./base64')
var request = require('./request')

var isArray = Array.isArray

function isArrayBuffer (o) { return o instanceof ArrayBuffer }
function isObject (o) { return typeof o === 'object' }
function isStr (o) { return typeof o === 'string' }
function isPromise (o) { return o && typeof o.then === 'function' }

function tester (r) {
  return function (o) { return isStr(o) && r.test(o) }
}
var isBase64Audio = tester(/^data:audio/)
var isAudioFileName = tester(/\.(mp3|wav|ogg)(\?.*)?$/i)
var isJsonFileName = tester(/\.json(\?.*)?$/i)
var isJsFileName = tester(/\.js(\?.*)?$/i)
var isSoundFont = tester(/^@soundfont\//)

/**
 * Load one or more audio files
 *
 * @param {AudioContext} ac - the audio context
 * @param {Object} source - the object to be loaded
 * @param {Object} options - (Optional) the load options for that object
 */
function load (ac, source, options) {
  if (isPromise(source)) return source.then(function (v) { return load(ac, v, options) })

  var opts = options || {}
  var loader = isArrayBuffer(source) ? loadArrayBuffer
    : isAudioFileName(source) ? loadAudioFile
    : isBase64Audio(source) ? loadBase64Audio
    : isArray(source) ? loadArrayData
    : isObject(source) ? loadObjectData
    : isJsonFileName(source) ? loadJsonFile
    : isJsFileName(source) ? loadMidiJSFile
    : isSoundFont(source) ? loadSoundFont
    : opts.bypass ? loadValue
    : null

  return loader ? loader(ac, source, opts)
    : Promise.reject('Source not valid (' + source + ')')
}
load.request = request

function loadBase64Audio (ac, source, options) {
  var i = source.indexOf(',')
  return load(ac, base64.decode(source.slice(i + 1)).buffer, options)
}

function loadArrayBuffer (ac, array, options) {
  return new Promise(function (done, reject) {
    ac.decodeAudioData(array,
      function (buffer) { done(buffer) },
      function () { reject("Can't decode audio data (" + array.slice(0, 30) + '...)') }
    )
  })
}

function buildUrl (name, options) {
  return typeof options.from === 'string' ? options.from + name
    : typeof options.from === 'function' ? options.from(name)
    : name
}

function loadAudioFile (ac, name, options) {
  var url = buildUrl(name, options)
  return load(ac, load.request(url, 'arraybuffer'), options)
}

function loadArrayData (ac, array, options) {
  return Promise.all(array.map(function (data) {
    return isAudioFileName(data) ? load(ac, data, options) : Promise.resolve(data)
  }))
}

function loadObjectData (ac, obj, options) {
  var opts = Object.assign({}, options)
  opts.bypass = true
  var dest = {}
  var promises = Object.keys(obj).map(function (key) {
    var value = obj[key]
    return load(ac, value, opts).then(function (audio) {
      dest[key] = audio
    })
  })
  return Promise.all(promises).then(function () { return dest })
}

// wrap a value into a promise
function loadValue (ac, value, options) {
  return Promise.resolve(value)
}

function loadJsonFile (ac, name, options) {
  var url = buildUrl(name, options)
  return load(ac, load.request(url, 'text').then(JSON.parse), options)
}

function loadMidiJSFile (ac, name, options) {
  var url = buildUrl(name, options)
  return load(ac, load.request(url, 'text').then(soundfontToJson), options)
}

function loadSoundFont (ac, sf, options) {
  var name = sf.slice(sf.indexOf('/'))
  var url = 'https://cdn.rawgit.com/gleitz/midi-js-Soundfonts/master/FluidR3_GM/' + name + '-ogg.js'
  return load(ac, url, options)
}

function soundfontToJson (data) {
  var begin = data.indexOf('MIDI.Soundfont.')
  if (begin < 0) throw Error('Invalid MIDI.js Soundfont format')
  begin = data.indexOf('=', begin) + 2
  var end = data.lastIndexOf(',')
  return JSON.parse(data.slice(begin, end) + '}')
}

if (typeof module === 'object' && module.exports) module.exports = load
if (typeof window !== 'undefined') window.loadAudio = load
