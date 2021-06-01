var flow = require('nimble')

const tasks = [
  function (cb) {
    setTimeout(function () {
      console.info('I go first')
      cb()
    }, 1000)
  },
  function (cb) {
    setTimeout(function () {
      console.info('I go second')
      cb()
    }, 500)
  },
  function (cb) {
    setTimeout(function () {
      console.info('I go third')
      cb()
    }, 100)
  },
]

flow.series(tasks)
// flow.parallel(tasks)