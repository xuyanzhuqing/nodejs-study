// 跨站请求避险 https://tech.meituan.com/2018/10/11/fe-security-csrf.html

var cookieParser = require('cookie-parser')
var csrf = require('csurf')
var bodyParser = require('body-parser')
var express = require('express')

// create express app
var app = express()

// 模板做法
app.set("views","mb");//设置需要渲染的目录下模板文件
app.set("view engine","ejs"); // 设置渲染引擎

// 单页应用
// app.all('*', function (req, res) {
//   res.cookie('XSRF-TOKEN', req.csrfToken())
//   res.render('index')
// })

// create api router
var api = createApiRouter()

// mount api before csrf is appended to the app stack
app.use('/api', api)

// now add csrf and other middlewares, after the "/api" was mounted
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(csrf({ cookie: true }))

app.get('/form', function (req, res) {
  // 原始做法
  // const csrfToken = req.csrfToken()
  // res.send(`
  //   <form action="/process" method="POST">
  //     <input type="hidden" name="_csrf" value="${csrfToken}">
      
  //     Favorite color: <input type="text" name="favoriteColor">
  //     <button type="submit">Submit</button>
  //   </form>
  // `)

  // 模板做法
  // pass the csrfToken to the view
  res.render('send', { csrfToken: req.csrfToken(), title: 'hello', welcome: 'cungen' })
})

app.post('/process', function (req, res) {
  res.send('csrf was required to get here')
})

function createApiRouter () {
  var router = new express.Router()

  router.post('/getProfile', function (req, res) {
    res.send('no csrf to get here')
  })

  return router
}

app.listen(3000)