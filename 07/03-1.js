// test limit 测试 攻方
const http = require('http')

var req = http.request({
  port: 3000,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'content-length': 1024*32
  }
})

req.write('[')

let n = 30

while (n-- > 0) {
  req.write('"foo",')
}

console.info('buuu')

req.write('"bar"]')

req.end()