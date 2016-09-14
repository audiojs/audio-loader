
function arrToBase64Audio (arr) {
  var data = new Buffer(arr).toString('base64')
  return 'data:audio/mp3;base64,' + data
}

function strToBase64Audio (str) {
  return arrToBase64Audio(strToArrayBuffer(str))
}

function strToArrayBuffer (str) {
  var buf = new ArrayBuffer(str.length * 2) // 2 bytes for each char
  var bufView = new Uint16Array(buf)
  for (var i = 0, len = str.length; i < len; i++) {
    bufView[i] = str.charCodeAt(i)
  }
  return buf
}

function arrayBufferToStr (buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf))
}

function decode (buffer) {
  return new Promise(function (resolve, reject) {
    buffer ? resolve(arrayBufferToStr(buffer)) : reject('Buffer not present')
  })
}

var audioContext = {
  decodeAudioData: function (array, done, err) {
    if (!array) err('Array not present')
    done(arrayBufferToStr(array))
  }
}

function fetcher (files) {
  return function fn (url, type) {
    fn.url = url
    var data = files[url]
    if (!data) return Promise.reject('Url not found: ' + url)
    return Promise.resolve(type === 'arraybuffer' ? strToArrayBuffer(data) : data)
  }
}

module.exports = {
  strToArrayBuffer: strToArrayBuffer,
  arrayBufferToStr: arrayBufferToStr,
  strToBase64Audio: strToBase64Audio,
  arrToBase64Audio: arrToBase64Audio,
  audioContext: audioContext,
  fetcher: fetcher,
  decode: decode
}
