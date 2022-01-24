// token 校验 

const express = require('express')
const app = express()
const port = 3000

const basicAuth = require('express-basic-auth')
 
// 整体设置
// app.use(basicAuth({
//     users: { 'admin': 'admin' }
// }))
// https://github.com/LionC/express-basic-auth/blob/master/example.js

const single = basicAuth({
  users: { 'admin': 'admin' },
  unauthorizedResponse: "valid request",
})

// 异步校验
// var asyncAuth = basicAuth({
//   authorizer: (username, password, callback),
//   authorizeAsync: true
// })
/**
function myAsyncAuthorizer(username, password, cb) {
  if(username.startsWith('A') && password.startsWith('secret'))
      return cb(null, true)
  else
      return cb(null, false)
}
 */

// 单个设置
app.put('/', single, function (req, res, next) {
  res.send('test')
})

app.get('/', (req, res) => {
  // res.send('Hello World!')
  res.setHeader('Content-Type', 'text/html')
  res.write(`
    <script>
      window.onload = function () {
        const btn = document.getElementsByTagName('button')[0]
        btn.onclick = function () {
          fetch('/', {
            method: 'PUT',
            headers: {
              Authorization: 'Basic ' + btoa("admin:admin") // btoa 类似于base64.encode
            }
          }).then((res) => {
            debugger
          })
        }
      }
    </script>
  `)
  res.write('<button>test</button>')
  res.send()
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

// 请求
// axios({ url, method, auth: {username: 'admin', password: 'admin'} })