const connect = require('connect')

const app = connect()

const Logger = (req, res, next) => {
  console.info(`method: ${req.method} url: ${req.url}`)
  next()
}

const HelloWorld = (req, res, next) => {
  res.setHeader('Content-Type', 'text/html')

  res.write(`
    <html>
      <b>hello world</b>
    </html>
  `)
  res.end()
  next()
  // 可以缩写成
  // res.end(***)
}

// 调用中间件
app
  .use(Logger)
  .use(HelloWorld)

app.listen(3000)