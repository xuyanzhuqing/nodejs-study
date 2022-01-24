const http = require('http')
const path = require('path')
const fs = require('fs')
const Formidable = require('formidable')
var socketIo = require('socket.io')
const imgageList = []

const server = http.createServer(function (req, res) {
  if (req.url !== '/') {
    notFound(res)
    return
  }
  switch (req.method) {
    case 'POST': add(req, res) 
      break
    case 'DELETE': del(req, res)
      break
    default:
      show(req, res)
  }
})

// 多媒体数据类型
const contentType = 'multipart/form-data'

server.listen(3000)

function notFound (res) {
  res.statusCode = 404
  res.setHeader('Content-Type', 'text/plain')
  res.end('Not Found')
}

function add(req, res)  {
  if (!isFormidable(req)) {
    res.statusCode = 400
    res.end('Bad Request: Except ' + contentType)
    return
  }

  let filename = ''
  let extname = ''
  let tmpName = ''
  const uploadDir = path.join(__dirname, './img')
  let progressNum = 0
  // 默认将文件存放到 /tmp 目录下 os.tmpdir
  let io = socketIo(server)

  io.on('connection', function (socket) {

  })
  const formidable = new Formidable({ uploadDir })
  const progress = function (received, expected) {
    progressNum = Math.floor(received / expected) * 100
  }
  formidable.on('progress', progress)
  
  formidable.on('field', function (field, value) {
    if (field === 'filename') {
      filename = value
    }
    console.info(field, value)
  })

  formidable.on('file', function (name, file) {
    extname = path.extname(file.name)
    tmpName = path.basename(file.path)
    console.info(name, file.name)
  })

  formidable.on('end', function () {
    const oldPath = path.join(uploadDir, tmpName)
    const newPath = path.join(uploadDir, filename + extname)
    fs.rename(oldPath, newPath, function (err) {
      if (err) {
        res.end(JSON.stringify({
          success: false,
          message: 'rename file filed'
        }))
      } else {
        imgageList.push(path.basename(newPath))
        show(req, res)
      }
    })
  })

  formidable.parse(req, function (err, fileds, files) {
    // console.info(err, fileds, files)
  })

}

function isFormidable (req) {
  const type = req.headers['content-type'] || ''
  return 0 === type.indexOf(contentType)
}

function del(req, res)  {

}

function show(req, res)  {
  const html = `
    <html>
      <head>
        <title>file upload</title>
        <meta charset="utf-8"/>
        <script src="/socket.io/socket.io.js"></script>
      </head>
      <body>
        <dl>
          <dt>文件列表</dt>
          ${
            imgageList.map(v => '<dd>'+ v +'</dd>')
          }
        </dl>

        <form method="post" action="/" enctype="${contentType}">
          <input type="file" name="file"/>
          <input type="input" name="filename"/>
          <input type="submit" value="upload"/>
        </form>
        <script>
          var socket = io();
          socket.on('progress', function (progress) {
            console.info(progress)
          })
        </script>
      </body>
    </html>
  `
  req.setEncoding('utf8')
  
  // 如果不设置长度，页面则不知道何时放回数据，一直出于pedding 状态
  res.setHeader('Content-Length', Buffer.byteLength(html))
  res.setHeader('Content-Type', 'text/html')
  res.end(html)
}
