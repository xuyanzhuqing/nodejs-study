// 静态目录
const http = require('http')
const connect = require('connect')
const server = require('express-static')

const app = connect()

app
  .use(server(__dirname + '/mb'))
  .use('/js', server(__dirname + '/mb/js'))
  .use('/css', server(__dirname + '/mb/css'))

http.createServer(app).listen(3000)