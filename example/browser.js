var load = require('..')
var ac = require('audio-context')

addTitle(1, '<code>audio-loader</code> examples')
addExample('Load wav audio file', function () {
  load('example/samples/maeclave.wav').then(playBuffer).catch(err)
})
addExample('Load mp3 audio file', function () {
  load('example/samples/drumroll.mp3').then(playBuffer).catch(err)
})
addExample('Load object with filenames', function () {
  load({ snare: 'maesnare.wav', clave: 'maeclave.wav' }, { from: 'example/samples/' })
    .then(playObject).catch(err)
})
addExample('Load array of filenames', function () {
  load(['maesnare.wav', 'maeclave.wav'], { from: 'example/samples/' })
    .then(playArray).catch(err)
})
addExample('Load mp3 soundfont file', function () {
  load('http://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/marimba-mp3.js')
    .then(playNotes('C4 D4 E4 F4 G4 A4 B4 C5')).catch(err)
})
addExample('Load ogg soundfont file', function () {
  load('http://gleitz.github.io/midi-js-soundfonts/MusyngKite/kalimba-ogg.js')
    .then(playNotes('C4 D4 E4 F4 G4 A4 B4 C5')).catch(err)
})
addExample('Load drum machine', function () {
  load('https://danigb.github.io/sampled/CR-78/CR-78.json').then(function (inst) {
    playArray(Object.keys(inst.samples).map(function (name) {
      return inst.samples[name]
    }))
  }).catch(err)
})
addExample('Load a js module', function () {
  load(require('./samples/piano-note.audio.js')).then(playBuffer).catch(err)
})

function playBuffer (buffer, time) {
  var source = ac.createBufferSource()
  source.buffer = buffer
  source.connect(ac.destination)
  source.start(time || ac.currentTime)
}
function playArray (array) {
  var now = ac.currentTime
  array.forEach(function (buffer, i) {
    playBuffer(buffer, now + i * 0.5)
  })
}
function playObject (obj) {
  playArray(Object.keys(obj).map(function (n) { return obj[n] }))
}
function playNotes (notes) {
  return function (inst) {
    playArray(notes.split(' ').map(function (note) {
      return inst[note]
    }))
  }
}
function err (error) {
  console.log('Error', error)
}

function append (el) { document.body.appendChild(el) }
function addTitle (num, text) { append(h('h' + num, null, text)) }

function addExample (name, cb) {
  append(h('h3', null, [h('a', {
    href: '#',
    onclick: function (e) { e.preventDefault(); cb() }
  }, name)]))
  append(h('pre', null, cb.toString()))
}

function h (name, props, children) {
  props = props || {}
  var el = document.createElement(name)
  Object.assign(el, props)
  if (typeof children === 'string') el.innerHTML = children
  else if (Array.isArray(children)) {
    children.forEach(function (c) {
      el.appendChild(c)
    })
  }
  return el
}
