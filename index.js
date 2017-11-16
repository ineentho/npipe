#!/usr/bin/env node
const runApp = require('./src/app.js')
const parseOpts = require('./src/optsParser.js')

process.on('unhandledRejection', err => {
  throw err
})

const opts = parseOpts()
console.log(opts)

runApp(opts).pipe(process.stdout)
