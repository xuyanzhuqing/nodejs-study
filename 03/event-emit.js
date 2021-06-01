var EventEmitter = require('events').EventEmitter

var channel = new EventEmitter()

var o = new Object

channel.on(o, function () {
  console.info('welcome')
})

setTimeout(() => {
  channel.emit(o)
}, 3000)
