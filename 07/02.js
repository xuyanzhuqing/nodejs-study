const connect = require('connect')
const bodyParser = require('body-parser')
const app = connect()
  .use(bodyParser())
  .use(function (req, res){

    console.info(req.body)
    // 解析文件
    console.info(req.files)

    res.end('hello world\n\r')
  }).listen(3000)

// 发送 json 数据
// curl -d '{"username": "michael"}' -H "Content-Type:application/json" localhost:3000

// 解析 form
// curl -d username=michael localhost:3000
// curl -d 'username=michael&age=18' localhost:3000

// 解析 文件
// curl -F image=@/home/michael/learn-node/07/tree.jpg -F name=wood http://localhost:3000
// curl -F 'file=@"/home/michael/learn-node/07/tree.jpg";filename="wood.jpg"' http://localhost:3000