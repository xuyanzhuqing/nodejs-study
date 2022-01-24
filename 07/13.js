// 压缩目录
const http = require('http')
const connect = require('connect')
const server = require('express-static')
const compression = require('compression')
const app = connect()

// gzip [target] -k // 压缩文件保留源文件

app
  .use(compression({
    level: 3
  }))
  .use(server(__dirname + '/mb'))
  .use('/js', server(__dirname + '/mb/js'))
  .use('/css', server(__dirname + '/mb/css'))

http.createServer(app).listen(3000)