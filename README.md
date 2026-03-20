# audio-loader

> **Deprecated.** The problem this package solved — fetching and decoding audio into AudioBuffers — is now handled natively by the platform. See [migration guide](#migration) below.

---

## Why deprecated?

When audio-loader was created (2015), loading audio required juggling `XMLHttpRequest`, callback-based `decodeAudioData`, and Node.js `request`. In 2026, native `fetch()` and promise-based `decodeAudioData()` make this a two-liner:

```js
// Browser
const buffer = await fetch(url).then(r => r.arrayBuffer())
const audio = await audioContext.decodeAudioData(buffer)
```

```js
// Node
import { readFile } from 'fs/promises'
import { decode } from 'audio-decode'

const audio = await decode(await readFile('./sample.wav'))
```

This package also carries a deprecated dependency (`request`) and other outdated polyfills. Rather than rewrite what the platform now provides, we're archiving it.

## Migration

### Single file (browser)

```js
// before
const buffer = await load('sample.mp3')

// after
const ac = new AudioContext()
const buffer = await fetch('sample.mp3')
  .then(r => r.arrayBuffer())
  .then(buf => ac.decodeAudioData(buf))
```

### Batch loading

```js
// before
const sounds = await load({ snare: 'snare.wav', kick: 'kick.wav' }, { from: baseUrl })

// after
const files = { snare: 'snare.wav', kick: 'kick.wav' }
const ac = new AudioContext()
const load = url => fetch(baseUrl + url).then(r => r.arrayBuffer()).then(buf => ac.decodeAudioData(buf))
const sounds = Object.fromEntries(
  await Promise.all(Object.entries(files).map(async ([k, v]) => [k, await load(v)]))
)
```

### Node.js

Use [audio-decode](https://github.com/nicktomlin/audio-decode) directly — it handles mp3, wav, ogg, m4a, flac, and aac.

### MIDI.js soundfonts

If you relied on the MIDI.js soundfont parser, here is the extraction (~10 lines):

```js
function parseMidiJsSoundfont(text) {
  const begin = text.indexOf('MIDI.Soundfont.')
  if (begin < 0) throw new Error('Invalid MIDI.js Soundfont format')
  const eqPos = text.indexOf('=', begin) + 2
  const end = text.lastIndexOf(',')
  return JSON.parse(text.slice(eqPos, end) + '}')
}
```

---

## Original README

An simple and flexible audio buffer loader for browser **and node**:

```js
var load = require('audio-loader')

// load one file
load('http://example.net/audio/file.mp3').then(function (buffer) {
  console.log(buffer) // => <AudioBuffer>
})

// load a collection of files
load({ snare: 'samples/snare.wav', kick: 'samples/kick.wav' },
  { from: 'http://example.net/'} ).then(function (audio) {
  console.log(audio) // => { snare: <AudioBuffer>, kick: <AudioBuffer> }
})
```

## Features

- Load single audio files or collection of them (either using arrays or data objects)
- Load base64 encoded audio strings
- Compatible with midi.js pre-rendered soundfonts packages like [midi-js-soundfonts](https://github.com/gleitz/midi-js-soundfonts/tree/master/MusyngKite)
- Compatible with json encoded audio like [sampled](https://github.com/danigb/sampled)


## Install

__Npm__

`npm i --save audio-loader`

__Yarn__

`yarn add audio-loader`

__Browser__

Download the [minified distribution](https://raw.githubusercontent.com/danigb/audio-loader/master/dist/audio-loader.min.js) which exports `loadAudio` as window global:

```html
<script src="audio-loader.min.js"></script>
<script>
  loadAudio({ snare: 'snare.wav' }, { from: 'oramics.github.io/sampled/' }).then(..)
</script>
```

## Usage

<a name="load"></a>

#### Load audio files

You can load individual or collection of files:

```js
load('http://path/to/file.mp3').then(function (buffer) {
  // buffer is an AudioBuffer
  play(buffer)
})

// apply a prefix using options.from
load(['snare.mp3', 'kick.mp3'], { from: 'http://server.com/audio/' }).then(function (buffers) {
  // buffers is an array of AudioBuffers
  play(buffers[0])
})

// the options.from can be a function
function toUrl (name) { return 'http://server.com/samples' + name + '?key=secret' }
load({ snare: 'snare.mp3', kick: 'kick.mp3' }, { from: toUrl }).then(function (buffers) {
  // buffers is a hash of names to AudioBuffers
  play(buffers['snare'])
})
```

#### Recursive loading

`audio-loader` will detect if some of the values of an object is an audio file name and try to fetch it:

```js
var inst = { name: 'piano', gain: 0.2, audio: 'samples/piano.mp3' }
load(inst).then(function (piano) {
  console.log(piano.name) // => 'piano' (it's not an audio file)
  console.log(piano.gain) // => 0.2 (it's not an audio file)
  console.log(piano.audio) // => <AudioBuffer> (it loaded the file)
})
```

#### Load soundfont files

If you provide a `.js` file, `audio-loader` will interpret it as a [midi.js](https://github.com/mudcube/MIDI.js) soundfont file and try to load it:

```js
load('acoustic_grand_piano-ogg.js').then(function (buffers) {
  buffers['C2'] // => <AudioBuffer>
})
```

This is a repository of them: https://github.com/gleitz/midi-js-soundfonts

#### API
### `load(source, [options])`

| Param | Type | Description |
| --- | --- | --- |
| source | <code>Object</code> | the object to be loaded: can be an URL string, ArrayBuffer with encoded data or an array/map of sources |
| options | <code>Object</code> | (Optional) the load options for that source |

Possible `options` keys are:

- __from__ {Function|String}: a function or string to convert from file names to urls.
If is a string it will be prefixed to the name:
`load('snare.mp3', { from: 'http://audio.net/samples/' })`
If it's a function it receives the file name and should return the url as string.
- __only__ {Array} - when loading objects, if provided, only the given keys
will be included in the decoded object:
`load('piano.json', { only: ['C2', 'D2'] })`
- __context__ {AudioContext}: (browser only) The audio context to use. By default uses [`audio-context`](https://www.npmjs.com/package/audio-context)
- __decode__ {Function}: a function to decode audio. It receives a buffer and must return a promise to an audio buffer.
- __fetch__ {Function}: a function to fetch files. It receives an url and a response type (one of 'arraybuffer' or 'text') and must return a promise to the contents

## Run tests and examples

To run the test, clone this repo and:

```bash
npm install
npm test
```

To run the browser example:

```bash
npm i -g budo
npm run browser-example
```

To run the node (audiojs) example:

```bash
node example/node.js
```

## License

MIT License
