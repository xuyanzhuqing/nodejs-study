// test limit server
const connect = require('connect')
var getRawBody = require('raw-body')
var http = require('http');
// var contentType = require('content-type')
const bodyParser = require('body-parser')

var app = connect()

const limited = function (type, limit) {
  return function (req, res, next) {
    if (req.headers['content-type'] && !req.headers['content-type'].includes(type)) {
      next()
      return
    }
    console.info(req.headers['content-type'])

    getRawBody(req, {
      // length: 10,
      limit: limit,
      // encoding: contentType.parse(req).parameters.charset
    }, function (err, string) {
      if (err) return next(err)
      req.text = string
      next()
    })
  }
}

app.use(limited('application/json', '20kb'))
app.use(limited('image', '2mb'))
app.use(limited('video', '200mb'))

app.use((req, res) => {
  res.end(req.text + '\n')
})

http.createServer(app).listen(3000)