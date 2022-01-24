// 一个可配置的中间件 --- 路由中间件
const connect = require('connect')
const app = connect()
// 可以配置router 参数
const router = require('./routes/router.js')({
  mode: 'hash'
})

const Logger = (req, res, next) => {
  console.info(`method: ${req.method} url: ${req.url}`)
  next()
}

const HelloWorld = (req, res, next) => {
  res.setHeader('Content-Type', 'text/html')
  res.end(`
    <html>
      <b>hello world</b>
    </html>
  `)
}

// 记录 log 日志
const ErrorHanlderLog = (err, req, res, next) => {
  console.info(err.stack)
  next(err)
}

// 返回错误代码
const ErrorHanlder = (err, req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  if (err.code === 404) {
    res.statusCode = 404
    res.end(JSON.stringify({ message: 'not found' }))
  } else {
    res.statusCode = 5000
    res.end(JSON.stringify({ message: '这是一个自定义错误' }))
  }
}

app
  .use(Logger)
  .use(router)
  .use(HelloWorld)
  // 多个错误 handler
  .use(ErrorHanlderLog)
  .use(ErrorHanlder)

app.listen(3000)