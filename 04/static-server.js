// 一个静态服务器
const http = require('http')
const fs = require('fs')
const join = require('path').join
const parse = require('url').parse

const root = __dirname

http.createServer(function (req, res) {
  var url = parse(req.url)
  const path = join(root, url.pathname)

  const stream = fs.createReadStream(path)
  stream.on('data', function (chunk) {
    res.write(chunk)
  })
  stream.on('end', function () {
    res.end()
  })
}).listen(3000)
