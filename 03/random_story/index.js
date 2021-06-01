// 串行执行

const fs = require('fs')
const request = require('request')
const htmlparser = require('htmlparser')
const configFilename = './rss_feeds.txt'

function checkForRSSFile () {
  fs.stat(configFilename, function (err, stat) {
    if (err) return next(new Error(configFilename + ' is not existed'))
    next(null, configFilename)
  })
}

function readRssFile (configFilename) {
  fs.readFile(configFilename, function (err, data) {
    if (err) return next(err)
    data = data
      .toString()
      .replace(/^\s+|\s+$/g, '')
      .split('\n')
    var random = Math.floor(data.length * Math.random())
    next(null, data[random])
  })
}

function downloadRSSFeed (feedUrl) {
  console.info(feedUrl)
  request({ url: feedUrl }, function (err, res, body) {
    if (err || res.statusCode !== 200) return next(err)
    next(null, body)
  })
}

function parseRSSFeed (body) {
  var hanlder = new htmlparser.RssHandler()
  var parser = new htmlparser.Parser(hanlder)
  parser.parseComplete(body)
  if (!hanlder.dom.length) {
    return next(new Error('No RSS items found'))
  }

  // dom 树
  var item = hanlder.dom
  console.info(item)
}

var tasks = [checkForRSSFile, readRssFile, downloadRSSFeed, parseRSSFeed]

function next (err, result) {
  if (err) throw err
  var currentTask = tasks.shift()

  if (currentTask) {
    currentTask(result)
  }
}

next()