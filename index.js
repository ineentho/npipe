#!/usr/bin/env node
const es = require('event-stream')
const nopt = require('nopt')
const fs = require('fs')

process.on('unhandledRejection', err => {
  throw err
})

const knownOpts = {
  in: [String],
  out: [String],
}

const shorthands = {
  i: ['--in'],
  o: ['--out'],
}

const opts = nopt(knownOpts, shorthands)

if (!opts.in) {
  opts.in = 'json'
}

if (!opts.out) {
  opts.out = opts.in
}

const script = opts.argv.remain[0]
const inFiles = opts.argv.remain.slice(1)

const runScript = es.map((data, callback) =>
  Promise.resolve(eval(script)(data))
    .then(res => callback(null, res))
    .catch(callback),
)
const inStreams = inFiles.map(file => fs.createReadStream(file))
if (inStreams.length === 0) {
  inStreams.push(process.stdin)
}

const inParser = require(`npipe-plugin-${opts.in}`).in
const outParser = require(`npipe-plugin-${opts.out}`).out

es
  .merge(inStreams)
  .pipe(inParser)
  .pipe(runScript)
  .on('error', err => {
    throw err
  })
  .pipe(outParser)
  .pipe(es.join('\n'))
  .pipe(process.stdout)
