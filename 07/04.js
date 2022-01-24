const connect = require('connect')
const http = require('http')
const qs = require('qs')
const app = connect()

// app.use(function (req, res, next) {
//   const result = {}
//   const params = req.url.split('?')[1] || ''

//   params.split('&').map(v => {
//     const [key, value] = v.split('=')
//     result[key] = value
//   })

//   req.query = result
//   next()
// })

app.use('/', function (req, res, next) {
  const params = req.url.split('?')[1] || ''
  req.query = qs.parse(params, { delimiter: '&'})
  next()
})

app.use((req, res) => {
  console.info(req.query)
  res.end('hello \n')
})

http.createServer(app).listen(3000)

// curl http://localhost:3000/?a=1&b=2