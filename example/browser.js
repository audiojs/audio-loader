/* global AudioContext */

var ac = new AudioContext()
var load = require('..')

document.body.innerHTML = '<h2>audio-loader<h2><h1>Example</h1>(open the dev console)'

run(loadSample, loadObject, loadMidijs, loadJSONInst, loadJSON, loadBase64,
  loadSoundfont)

function playBuffer (buffer, when) {
  var source = ac.createBufferSource()
  source.buffer = buffer
  source.connect(ac.destination)
  source.start(when || ac.currentTime)
}

function play (name, samples, buffers) {
  if (typeof samples === 'string') samples = samples.split(' ')
  console.log('Playing:', name, samples)
  var now = ac.currentTime
  console.log(name, samples, now)
  samples.forEach(function (name, i) {
    playBuffer(buffers[name], now + 0.3 * i)
  })
}

function run () {
  var examples = Array.prototype.slice.call(arguments).reverse()
  var current = examples.length - 1
  var next = function (time) {
    if (current < 0) return
    var c = current
    time = time || 1000
    console.log('Next', current, examples[current].name)
    setTimeout(function () {
      examples[c](next)
    }, time)
    current--
  }
  next()
}
function loadDrumMachine (done) {
  load(ac, '@drum-machines/CR-78').then(function (maestro) {
    play('Maestro drum machine!', Object.keys(maestro.samples).reverse(), maestro.samples)
    done(6000)
  })
}
function loadSoundfont (done) {
  load(ac, '@soundfont/marimba').then(function (buffers) {
    play('Marimba!', 'C3 D3 E3 F3 G3 B3 C4 E4 B4 G4', buffers)
    done(2000)
  })
}

function loadJSONInst (done) {
  load(ac, 'example/samples/maestro.json').then(function (maestro) {
    play('Maestro instrument!', Object.keys(maestro.samples), maestro.samples)
    done()
  })
}

function loadJSON (done) {
  load(ac, 'example/samples/maestro.samples.json').then(function (buffers) {
    play('Maestro buffers', Object.keys(buffers), buffers)
    done()
  })
}

var audioData = require('./samples/blip.audio.js')
function loadBase64 (done) {
  load(ac, audioData).then(function (buffer) {
    console.log('base64 buffer', buffer)
    playBuffer(buffer)
    done()
  })
}

function loadSample (done) {
  console.log('Loading sample...')
  load(ac, 'example/samples/blip.wav').then(function (blip) {
    console.log('Playing blip...')
    var now = ac.currentTime
    playBuffer(blip, now)
    playBuffer(blip, now + 0.2)
    playBuffer(blip, now + 0.4)
    done()
  })
}

function loadObject (done) {
  var data = { 'snare': 'example/samples/maesnare.wav', clave: 'example/samples/maeclave.wav' }
  load(ac, data).then(function (buffers) {
    play('Object', 'clave snare', buffers)
    done()
  })
}

function loadMidijs (done) {
  load(ac, 'example/samples/piano-oct4-ogg.js').then(function (buffers) {
    play('Piano oct4', 'C4 D4 E4 F4 G4 B4', buffers)
    done(2000)
  })
}
