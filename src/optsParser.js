const nopt = require('nopt')

const parseOpts = () => {
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

  opts.script = opts.argv.remain[0]
  opts.inFiles = opts.argv.remain.slice(1)

  return opts
}

module.exports = parseOpts
