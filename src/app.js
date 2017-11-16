const es = require('event-stream')
const fs = require('fs')

const runApp = opts => {
  const { inFiles, script } = opts

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

  return es
    .merge(inStreams)
    .pipe(inParser())
    .pipe(runScript)
    .on('error', err => {
      throw err
    })
    .pipe(outParser())
    .pipe(es.join('\n'))
}

module.exports = runApp
