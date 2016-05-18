# audio-loader [![npm](https://img.shields.io/npm/v/audio-loader.svg)](https://www.npmjs.com/package/audio-loader)

[![Build Status](https://travis-ci.org/danigb/audio-loader.svg?branch=master)](https://travis-ci.org/danigb/audio-loader) [![Code Climate](https://codeclimate.com/github/danigb/audio-loader/badges/gpa.svg)](https://codeclimate.com/github/danigb/audio-loader) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard) [![license](https://img.shields.io/npm/l/audio-loader.svg)](https://www.npmjs.com/package/audio-loader)

An easy but powerfull audio buffer loader for browser:

```js
var ac = new AudioContext()
var load = require('audio-loader')

// load one file
load(ac, 'http://example.net/audio/file.mp3').then(function (buffer) {
  console.log(buffer) // => <AudioBuffer>
})

load(ac, { snare: 'samples/snare.wav', kick: 'samples/kick.wav' },
  { from: 'http://example.net/'} ).then(audio) {
  console.log(audio) // => { snare: <AudioBuffer>, kick: <AudioBuffer> }
})
```

## Features

- Load single audio files or collection of them (either using arrays or data objects)
- Load base64 encoded audio strings
- Compatible with midi.js pre-rendered soundfonts packages

## Install

Via npm: `npm i --save audio-loader` or grab the [browser ready file](https://raw.githubusercontent.com/danigb/audio-loader/master/dist/audio-loader.min.js) (4kb) which exports `loadAudio` as window global.

## Usage

<a name="load"></a>

The API is very simple: `load(ac, source, options)`

| Param | Type | Description |
| --- | --- | --- |
| ac | <code>AudioContext</code> | the audio context |
| source | <code>Object</code> | the object to be loaded |
| options | <code>Object</code> | (Optional) the load options for that object |

The options accepts:

- __from__: a prefix string or function to expand file names to urls: `load(ac, 'file.mp3', { from: 'http://server.com/audio/'})` will load the file from `http://server.com/audio/file.mp3`
- __only__: If loading an object, it will load only the given key values: `load(ac, { one: ..., two: ..., three: ... }, { only: ['one', 'three'] })` will not load `two`

#### Load audio files

You can load individual or collection of files:

```js
var ac = new AudioContext()
load(ac, 'http://path/to/file.mp3').then(function (buffer) {
  // buffer is an AudioBuffer
  play(buffer)
})

// apply a prefix using options.from
load(ac, ['snare.mp3', 'kick.mp3'], { from: 'http://server.com/audio/'}).then(function (buffers) {
  // buffers is an array of AudioBuffers
  play(buffers[0])
})

// the options.from can be a function
function toUrl (name) { return 'http://server.com/samples' + name + '?key=secret' }
load(ac, { snare: 'snare.mp3', kick: 'kick.mp3' }, { from: toUrl }).then(function (buffers) {
  // buffers is a hash of names to AudioBuffers
  play(buffers['snare'])
})
```

#### Using data objets to load audio files

You can use any data object, and `audio-loader` will load the values that references audio files while keep the rest of the data intact:

```js
var inst = { name: 'piano', gain: 0.2, audio: 'samples/piano.mp3' }
load(ac, inst).then(function (piano) {
  console.log(piano.name) // => 'piano' (it's not an audio file)
  console.log(piano.gain) // => 0.2 (it's not an audio file)
  console.log(piano.audio) // => <AudioBuffer> (it loaded the file)
})
```

#### Load soundfont files

You can load [midi.js](https://github.com/mudcube/MIDI.js) js soundfont files:

```js
load(ac, 'acoustic_grand_piano-ogg.js').then(function (buffers) {
  buffers['C2'] // => <AudioBuffer>
})
```

For example, you can use [rawgit](rawgit.com) to load soundfont files without need of a server:

```js
// build the instrument url
function instUrl(name, format) {
  format = format || 'ogg'
  return 'https://cdn.rawgit.com/gleitz/midi-js-Soundfonts/master' +
    '/FluidR3_GM/' + name + '-' + format + '.js'
}
load(ac, instUrl('acoustic_grand_piano', 'mp3')).then(function (buffers) {
  buffers['C2'] // => <AudioBuffer>
})
```

Remember that [rawgit is only for low-traffic urls](https://github.com/rgrove/rawgit/wiki/Frequently-Asked-Questions#can-i-use-a-rawgitcom-development-url-on-a-production-website-or-in-public-example-code)

## Run tests and examples

To run the test, clone this repo and:

```bash
npm install
npm test
```

To run the example:

```bash
npm i -g beefy
beefy example/example.js
```

## License

MIT License
