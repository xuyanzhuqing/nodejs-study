// 实现一个restful 服务器

// get： curl localhost:3000
// post: curl -d "aaa" localhost:3000
// delete: curl -X DELETE localhost:3000/0
// put: curl -X PUT localhost:3000/0?newVal=AAA

const http = require('http')
const url = require('url')
const stack = []
const server = http.createServer(function (req, res) {
  // 基本用法
  // res.write('hello world\n')
  // res.end()
  // 等同于 res.end('hello world')
  const method = (req.method || 'get').toLowerCase()
  switch (method) {
    case 'post':
      var item = ''
      req.setEncoding('utf-8')
      req.on('data', function (chunk) {
        item += chunk
      })
      req.on('end', function () {
        stack.push(item)
        res.end('OK\n')
      })
      break
    case 'delete':
      var path = url.parse(req.url).pathname
      var i = parseInt(path.slice(1), 10)
      if (isNaN(i)) {
        res.statusCode = 400
        res.end('Invalid id')
      } else if (typeof stack[i] === 'undefined') {
       res.statusCode = 404
       res.end('item not found')
      } else {
        stack.splice(i, 1)
        res.end('ok\n')
      }
      break
    case 'put':
      var { pathname, query } = url.parse(req.url)
      var i = parseInt(pathname.slice(1), 10)
      if (isNaN(i)) {
        res.statusCode = 400
        res.end('Invalid id')
      } else if (typeof stack[i] === 'undefined') {
       res.statusCode = 404
       res.end('item not found')
      } else {
        const newVal = query.split('&').map(v => {
          const [name, value] = v.split('=')
          return {
            name,
            value
          }
        })
        stack.splice(i, 1, newVal.find(v => v.name === 'newVal').value)
        res.end('ok\n')
      }
      break
      default:
        res.write(stack.join('\n'))
        res.end('\n')
  }
})

server.listen(3000)

// curl -d "aaaaa" localhost:3000
// curl -d "bbbbb" localhost:3000
// curl localhost:3000
// curl -X "delete" localhost:3000/1