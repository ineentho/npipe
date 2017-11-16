const runApp = require('../src/app.js')
const es = require('event-stream')

test('runApp should accept a single infile ', done => {
  const opts = {
    in: 'json',
    out: 'json',
    script: 'a => a',
    inFiles: ['tests/fixtures/jsonArray.json'],
  }

  runApp(opts).pipe(
    es.wait((err, body) => {
      expect(err).toBe(null)
      expect(JSON.parse(body)).toEqual([1, 2, 3])
      done()
    }),
  )
})

test('it should be possible to map the input', done => {
  const opts = {
    in: 'json',
    out: 'json',
    script: 'arr => arr.map(num => num * num)',
    inFiles: ['tests/fixtures/jsonArray.json'],
  }

  runApp(opts).pipe(
    es.wait((err, body) => {
      expect(err).toBe(null)
      expect(JSON.parse(body)).toEqual([1, 4, 9])
      done()
    }),
  )
})
