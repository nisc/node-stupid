#! /usr/bin/env node

// We don't need no IPv6

var cinema = 'towel.blinkenlights.nl'
  , port   = 23
  , client = require('net').connect(port, cinema)

require('colors').addSequencer('soup', (function () {
  var soup = ['red', 'blue', 'white']
    , ESCAPE = '\u001b'
    , prevprev
    , prev

  return function (letter) {
    if ((letter   === ' ') ||
        (letter   === ESCAPE) ||
        (prev     === ESCAPE && letter === '[') ||
        (prevprev === ESCAPE && prev   === '[')) {
      prevprev = prev
      return (prev = letter)
    } else {
      return letter[soup[~~(Math.random() * soup.length)]]
    }
  }
})())

client.on('connect' , handleConnect)
client.on('data'    , handleData)
client.on('end'     , handleEnd)

function handleConnect () {
  console.log('Welcome.')
}

function handleData (data) {
  process.stdout.write((''+data).soup)
}

function handleEnd () {
  console.log('Bye.')
}
