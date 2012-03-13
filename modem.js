#! /usr/bin/env node

var fs = require('fs')
  , cp = require('child_process')
  , proc = process
  , AVG_DELAY_MS = 150
  , CHUNK = 25

var args = proc.argv.slice(3)
  , exec = proc.argv[2]
  , streams
  , cmd

if (proc.argv.length > 2) {
  cmd = cp.spawn(exec, args, { cwd: proc.env.CWD })
  streams = [cmd.stdout, cmd.stderr]
} else {
  streams = [proc.stdin]
  proc.stdin.resume()
}

streams.forEach(function (stream) {
  stream.on('data', function (data) {
    stream.pause()
    var offset = 0
      , end = data.length
    ;
    (function writeChunk () {
      proc.stdout.write(data.slice(offset, Math.min(offset+CHUNK, end)))
      if ((offset += CHUNK) < end) {
        setTimeout(writeChunk, (.5 + Math.random()) * AVG_DELAY_MS)
      } else {
        stream.resume()
      }
    }).call()
  })
})
