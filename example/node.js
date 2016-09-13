var play = require('audio-play')
var load = require('../node')
global.Promise = require('bluebird')
Promise.longStackTraces()

load.skip = () => Promise.reject('skip')

function err () { console.log('Error:', arguments) }

console.log('Load a single sample from the filesystem')
load.skip(__dirname + '/samples/maeclave.wav').then(play).catch(err)

console.log('Load a single sample from http')
load.skip('https://danigb.github.io/sampled/CR-78/samples/cowbell.wav').then(play).catch(err)

console.log('Load a midijs soundfont format')
load('http://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/marimba-mp3.js').then(function (inst) {
  playSamples(inst, ['C4', 'D4', 'E4', 'F4', 'G4'])
})

console.log('Load a json with multiple encoded samples')
load.skip('https://danigb.github.io/sampled/CR-78/CR-78.json').then(function (inst) {
  var names = Object.keys(inst.samples)
  playSamples(inst.samples, names)
}).catch(err)

function playSamples (source, names) {
  names.forEach(function (name, i) {
    function playSample () {
      play(source[name])
    }
    setTimeout(playSample, 1000 * i)
  })
}
