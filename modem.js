#! /usr/bin/env node

var fs = require('fs')
  , cp = require('child_process')
  , proc = process
  , AVG_DELAY_MS = 150
  , AVG_CHUNKSZ = 25

var args = proc.argv.slice(3)
  , exec = proc.argv[2]
  , streams
  , cmd

// decide whether to spawn a new child process or simply read from stdin
if (typeof exec !== 'undefined') {
  cmd = cp.spawn(exec, args, { cwd: proc.env.CWD })
  streams = [{ in: cmd.stdout, out: proc.stdout },
             { in: cmd.stderr, out: proc.stderr }]
} else {
  streams = [{ in: proc.stdin, out: proc.stdout }]
  proc.stdin.resume()
}

streams.forEach(function (pair) {
  pair.in.on('data', function (data) {
    pair.in.pause()
    var offset = 0
      , chunksz = (.5 + Math.random()) * AVG_CHUNKSZ
      , end = data.length
    ;
    (function writeChunk () {
      pair.out.write(data.slice(offset, Math.min(offset+chunksz, end)))
      if ((offset += chunksz) < end) {
        setTimeout(writeChunk, (.5 + Math.random()) * AVG_DELAY_MS)
      } else {
        pair.in.resume()
      }
    }).call()
  })
})
