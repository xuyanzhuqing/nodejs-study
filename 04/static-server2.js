// 一个可以提交的表单
// 注意区分原生，与 fetch 的用法

const { NOTFOUND } = require('dns')
const http = require('http')
const queryString = require('querystring')
const multiparty = require('multiparty')

const items = []

http.createServer(function(req, res) {
  if ('/' === req.url) {
    switch (req.method) {
      case 'GET': show(res)
        break
      case 'POST': add(req, res)
        break
      case 'DELETE': del(req, res)
        break
      default: badRequest(res)
    }
  } else {
    NotFound(res)
  }

}).listen(3000)

function del (req, res) {
  // 注意区分与 queryString 的用法
  var form = new multiparty.Form();
  form.parse(req, function (err, fileds, files) {
    const { item } = fileds
    const itemIndex = items.findIndex(v => Buffer(v) === Buffer(item[0]))
    if (itemIndex > -1) {
      items.splice(itemIndex, 1)
      res.statusCode = 200
      res.end(JSON.stringify({
        success: true
      }))
    } else {
      res.statusCode = 200
      res.end(JSON.stringify({
        success: false
      }))
    }
  })
}

function show(res) {
  const html = `
    <html>
      <head>
        <title>TODO LIST</title>
        <script>
          const del = function () {
            const item = event.target.innerHTML
            const formData = new FormData()
            formData.append('item', item)
            fetch('/', {
              method: 'DELETE',
              body: formData
            })
            .then((res) => res.json())
            .then(res => {
              console.info(res)
            })
          }
        </script>
      </head>
      <body>
        <ul>
          ${
            items.map(item => '<li onclick="del()">'+ item +'</li>').join('')
          }
        </ul>
        <form action="/" method="post">
          <input type="input" name="item"/>
          <input type="submit" value="submit"/>
        </form>
        <script>
          document.getElementsByName('item')[0].focus()
        </script>
      </body>
    </html>
  `
  res.setHeader('Content-Type', 'text/html')
  // 知识点
  res.setHeader('Content-Length', Buffer.byteLength(html))
  res.end(html)
}

function add (req, res) {
  var body = ''
  req.setEncoding('utf8')
  req.on('data', function (chunk) {
    body += chunk
  })

  req.on('end', function () {
    // body = name=ann&age=18&home=shanghai+changning  => {name: 'ann', age: 18, home: 'shanghai changning'}
    const obj = queryString.parse(body)
    items.push(obj.item)
    show(res)
  })
}

function badRequest (res) {
  res.statusCode = 400
  res.setHeader('Content-Type', 'text/plain')
  res.end('Bad Request')
}

function NotFound (res) {
  res.statusCode = 404
  res.setHeader('Content-Type', 'text/plain')
  res.end('Not Found')
}