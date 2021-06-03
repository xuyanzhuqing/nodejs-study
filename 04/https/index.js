const https = require('https')
const fs = require('fs')

// 生成私钥, 注意是 1024 的整数倍
// openssl genrsa 1024*n > key.pem

// 生成证书
// openssl req -x509 -new -key key.pem > key-cert.pem

const options = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./key-cert.pem')
}
https.createServer(options, function (req, res) {
  res.writeHead(200)
  res.end('hello world\n')
}).listen(3000)

// 访问 https: https://localhost:30000