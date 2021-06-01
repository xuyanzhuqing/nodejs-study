// 文件监听器
// 文件名强制小写

const events = require('events').EventEmitter
const util = require('util')
const fs = require('fs')

function Watcher (watchDir, processedDir) {
  this.watchDir = watchDir
  this.processedDir = processedDir
}

util.inherits(Watcher, events.EventEmitter)

Watcher.prototype.watch = function () {
  var watcher = this
  fs.readdir(this.watchDir, function (err, files) {
    if (err) throw err
    for (var index in files) {
      watcher.emit('process', files[index])
    }
  })
}

Watcher.prototype.start = function () {
  var watcher = this
  fs.watchFile(this.watchDir, function (stat) {
    watcher.watch()
  })
}

var watcher = new Watcher('./', './')

watcher.on('process', function (file) {
  var watchFile = this.watchDir + '/' + file
  var processedFile = this.processedDir + '/' + file.toLowerCase()

  fs.rename(watchFile, processedFile, function (err) {
    if (err) throw err
  })
})

watcher.start()