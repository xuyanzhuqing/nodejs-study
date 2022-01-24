// 创建一个可挂载的中间件
// 正常访问 hello world
// 访问 /admin 需要带上权限
const connect = require('connect')

const Logger = (req, res, next) => {
  console.info(`method: ${req.method} url: ${req.url}`)
  next()
}

const HelloWorld = (req, res) => {
  res.setHeader('Content-Type', 'text/html')
  res.end(`
    <html>
      <b>hello world</b>
    </html>
  `)
}

const Redirect = (req, res, next) => {
  var authorization = req.headers.authorization

  if (!authorization) return next(new Error('Unuthorized!'))

  // 可以进入到数据库中查询是否有权限

  next()
}

const Admin = (req, res, next) => {
  switch (req.url) {
    case '/': res.end('try /users')
      break;
    case '/users':
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(['ann', 'michael']))
      break
  }
}

const app = connect()

app
  .use(Logger)
  // 核心在这
  .use('/admin', Redirect)
  .use('/admin', Admin)
  .use(HelloWorld)

app.listen(3000)