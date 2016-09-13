var play = require('audio-play')
var load = require('../node')

function err () { console.log('Error:', arguments) }

load(__dirname + '/samples/maeclave.wav').then(play).catch(err)

load('https://danigb.github.io/sampled/CR-78/samples/cowbell.wav').then(play).catch(err)
