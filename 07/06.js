const http = require('http')
const connect = require('connect')

// 内存中缓存 ico 图标
var favicon = require('serve-favicon')
var path = require('path')

const app = connect()

app.use(favicon(path.join(__dirname, 'favicon.ico')))
app.use((req, res) => {
  res.end('hello \n');
})

http.createServer(app).listen(3000)