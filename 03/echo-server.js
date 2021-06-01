var net = require('net')

net.createServer(function(socket) {
  // socket.on('data', function (data) {
  //   socket.write(data.toString()  + '2333')
  // })
  socket.once('data', function (data) {
    socket.write(data.toString()  + '2333')
  })
}).listen(3000)

// 测试方法： telnet localhost 3000 // 退出方法 ctrl + ]  => quit