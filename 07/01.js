const connect = require('connect')
const cookieParser = require('cookie-parser')
const app = connect()
  .use(cookieParser()) // 签名
  // .use(cookieParser('i am not fool')) // 签名
  .use(function (req, res, next) {
    // 打印客户端设置的cookie
    console.info(req.cookies)
    console.info(req.signedCookies)

    // 设置客户端cookie
    // res.setHeader('Set-Cookie', "foo=bar;")
    const now = new Date()
    const afterTen = now.getTime() + 10 * 1000
    now.setTime(afterTen)
    const expire = now.toString()

    // 设置出站cookie
    res.setHeader('Set-Cookie', "foo=bar;Expire=" + expire)

    res.end('hello world\n')
  })
  .listen(3001)

// curl 的使用方法
// http://www.ruanyifeng.com/blog/2019/09/curl-reference.html

// 常规cookie
// curl localhost:3000
// curl localhost:3000 -H "Cookie: foo=bar;bar=baz"

// 加密cookie
// curl localhost:3000 -H "Cookie: name=luna"

// json 化cookie
// curl localhost:3000 -H 'Cookie: foo=bar;bar=j:{"foo": "bar"}'
// curl localhost:3000 -H 'Cookie: foo=bar;aa=j:{"bb":["a","b"]'}
// curl localhost:3000 -H 'Cookie: foo=bar;aa=j:[1, "a"]'

// 查看出站cookie
// curl localhost:3000 -H "Cookie: foo=bar;bar=baz" --head