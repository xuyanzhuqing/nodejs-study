const redis = require('redis')
const client = redis.createClient(6379, '127.0.0.1')

client.on('error', function (err) {
  console.info(err)
})

client.get('a', redis.print)

// 关闭连接
client.end()