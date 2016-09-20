var play = require('audio-play')
var load = require('..')
var prompt = require('prompt')
var lenaWav = require('audio-lena/wav')
var lenaMp3 = require('audio-lena/mp3')
var path = require('path')

function err (error) { console.error('Error:', error) }

prompt.start()

function ask () {
  examples.forEach(function (example, i) {
    console.log('[' + i + '] ' + example[0])
  })
  console.log('Write a number or anything else to exit.')

  prompt.get('option', function (err, result) {
    if (err) throw Error(err)
    var option = result.option
    if (examples[option]) {
      examples[option][1]().then(function () {
        ask()
      })
    }
  })
}

var examples = [
  ['Load a .wav buffer directly', function () {
    return load(lenaWav).then(play).catch(err)
  }],
  ['Load a .mp3 buffer directly', function () {
    return load(lenaMp3).then(play).catch(err)
  }],
  ['Load a wav file', function () {
    return load(path.join(__dirname, 'samples/maeclave.wav'))
      .then(play).catch(err)
  }],
  ['Load a mp3 file', function () {
    return load(path.join(__dirname, 'samples/train.mp3')).then(play).catch(err)
  }],
  ['Load a ogg file', function () {
    return load(path.join(__dirname, 'samples/sound.ogg')).then(play).catch(err)
  }],
  ['Fetch a wav file', function () {
    return load('https://danigb.github.io/sampled/CR-78/samples/cowbell.wav')
      .then(play).catch(err)
  }],
  ['Fecth mp3 encoded soundfont', function () {
    return load('http://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/marimba-mp3.js').then(function (inst) {
      playSamples(inst, ['C4', 'D4', 'E4', 'F4', 'G4'])
    })
  }],
  ['Fetch drum machine', function () {
    return load('https://danigb.github.io/sampled/CR-78/CR-78.json').then(function (inst) {
      var names = Object.keys(inst.samples)
      playSamples(inst.samples, names)
    }).catch(err)
  }]
]

function playSamples (source, names) {
  names.forEach(function (name, i) {
    function playSample () {
      play(source[name])
    }
    setTimeout(playSample, 1000 * i)
  })
}

ask()
