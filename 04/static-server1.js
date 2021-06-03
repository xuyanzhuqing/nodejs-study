// 一个静态服务器
// pipe 流
// 错误处理
const http = require('http')
const fs = require('fs')
const join = require('path').join
const parse = require('url').parse

const root = __dirname

http.createServer(function (req, res) {
  var url = parse(req.url)
  const path = join(root, url.pathname === '/' ? '/public/index.html' : url.pathname)
  fs.stat(path, function (err, stats) {
    if (err) {
      if (err.code === 'ENOENT') {
        res.statusCode = 404
        res.end('Not Found')
      } else {
        res.statusCode = 500
        res.end('Internal Server Error\n')
      }
    } else {
      const stream = fs.createReadStream(path)
      stream.pipe(res)
      // 错误处理
      stream.on('error', function (err) {
        res.statusCode = 500
        res.end('Internal Server Error\n')
      })
    }
  })

}).listen(3000)
