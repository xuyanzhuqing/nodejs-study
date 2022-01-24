// express-session 配合 redis
/**
 * 类型     绘话存储    cookie
 * 位置     服务端      客户端
 * 安全性   安全        不安全
 * 持久化   可          不可
 */

// 启动redis  -> redis-server
// 启动redis-client -> redis-cli 

const http = require('http')
const bodyParser = require('body-parser')
const connect = require('connect')
const session = require('express-session')

const redis = require('redis')
let RedisStore = require('connect-redis')(session)
const password = '123456'
let redisClient = redis.createClient('6379', '127.0.0.1', {auth_pass: password})


const log4js = require('log4js')
log4js.configure({
  appenders: {
    "output": {
      type: 'dateFile',
      filename: 'all-log.log',
    }
  },
  categories: { default: { appenders: ['output'], level: 'info' } }
});
const logger = log4js.getLogger('redis')
logger.info("I came from 08.js");


const app = connect()

// express 兼容 https
// https://www.npmjs.com/package/express-session
// if (app.get('env') === 'production') {
//   app.set('trust proxy', 1) // trust first proxy
//   sess.cookie.secure = true // serve secure cookies
// }

app
.use(session({
  secret: password,
  resave: false,
  saveUninitialized: false,
  store: new RedisStore({ client: redisClient }),
  cookie: {
    maxAge: 5000 * 10,
    // secure: true,
    // httpOnly: true,
    // domain: 'http://sss',
    // path: '/'
  }
}))
.use(bodyParser())
.use('/logout', logout)
.use(detect)
.use('/login', login)
.use('/list', list)


http.createServer(app).listen(3000)

// 检测登陆
function detect (req, res, next) {
  logger.info(req.url + ':' + req.method)
  if (req.url === '/login') {
     next()
     return
  }
  if (req.session.username && req.session.password) {
    next()
  } else {
    res.end('<a href="/login">login</a>')
  }
}

function login (req, res, next) {
  if (req.method === 'GET') {
    res.setHeader('Content-Type', 'text/html')
    res.write('<form method="post" action="/login">')
    res.write('<input type="text" name="username" value="cungen"/>')
    res.write('<input type="password" name="password" value="18"/>')
    res.write('<button>login in</button>')
    res.write('</form>')
    res.end()
  } else if (req.method === 'POST') {
    req.session.username = req.body.username
    req.session.password = req.body.password
    list(req, res, next)
  } else {
    res.statusCode = 400
    res.end('Invalid method:' + req.method)
  }
}

function logout (req, res, next) {
  logger.info(req.url + ':' + req.method)
  req.session.destroy(function (err) {
    if (err) {
      res.json({
        code: 500,
        msg: 'an error occored'
      })
      return
    }
    res.end('<a href="/login">login</a>')
  })
}

function list (req, res, next) {
  const cookie = req.session.cookie

  res.setHeader('Content-Type', 'text/html')
  res.write('<p>welcome</p>')
  res.write(`<p>expires in : ${cookie.maxAge / 1000}s</p>`)
  res.write(`<p>httpOnly: ${cookie.httpOnly}</p>`)
  res.write(`<p>path: ${cookie.path}</p>`)
  res.write(`<p>domain: ${cookie.domain}</p>`)
  res.write(`<p>secure: ${cookie.secure}</p>`)

  res.write(`<p>${JSON.stringify(req.session)}</p>`)
  res.write(`
    <form method="post" action="/logout">
      <button>exit</button>
    </form>
  `)
  res.end()
}