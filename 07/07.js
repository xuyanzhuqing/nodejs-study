// 由于原生表单仅仅支持post, get, 无法支持put delete 等
// method-override 重写了 req.method
// 原 method 见 req.originalMethod

const http = require('http')
const connect = require('connect')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const app = connect()

function edit (req, res, next) {
  if (req.method !== 'GET') next()

  res.setHeader('Content-Type', 'text/html')
  res.write('<form method="post" action="/updated?_method=PUT">')

  res.write('<input type="text" name="name" value="cungen"/>')
  res.write('<input type="number" name="age" value="18"/>')
  res.write('<button>update</button>')
  res.write('</form>')

  res.end()
}

function update (req, res, next) {
  if (req.method !== 'PUT') next()
  res.setHeader('Content-Type', 'text/html')
  res.end(`<p>form has updated ${req.body.name + req.body.age}</p>`)
}

app
  .use(bodyParser())
  .use(methodOverride('_method'))
  .use('/get', edit)
  .use('/updated', update)
  .use((req, res) => {
    res.end('<a href="/get">get</a>')
  })

http.createServer(app).listen(3000)