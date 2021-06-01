// 轻聊吧
// 测试方法
// node simple-chat.js
// 新开dos telnet localhost 3000

var EventEmitter = require('events').EventEmitter
var net = require('net')

var channel = new EventEmitter()

// 设置最多客户端数量，超出警告
channel.setMaxListeners(2)

channel.clients = {}
channel.subscriptions = {}

channel.on('join', function (id, client) {
  channel.clients[id] = client
  channel.subscriptions[id] = function (senderId, message) {
    // 闭包
    if (id !== senderId) {
      this.clients[id].write(message)
    }
  }
  channel.on('broadcast', this.subscriptions[id])
})

var server = net.createServer(function (client) {
  var id = client.remoteAddress + ':' + client.remotePort
  // client.on('connect', function () {
    channel.emit('join', id, client)
  // })

  client.on('data', function (message) {
    const data = message.toString()
    if (data.startsWith('/shutdown')) {
      return channel.emit('shutdown')
    }

    if (data.startsWith('/error')) {
      return channel.emit('error', new Error(data.split(' ')[1]))
    }

    channel.emit('broadcast', id, data)
  })

  channel.on('shutdown', function () {
    channel.emit('broadcast', '', "chat has cut down.\n")
    channel.removeAllListeners('broadcast')
  })

  // 自定义错误，可以防止程序运行时奔溃
  channel.on('error', function (err) {
    console.log(err)
  })
  channel.on('error', function (err) {
    console.info('二号错误', err)
  })
})

server.listen(3000)