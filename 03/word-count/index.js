// 统计字数

const fs = require('fs')
const counter = {}
const tasks = []
let counterNum = 0

function ifComplete () {
  counterNum++
  if (counterNum === tasks.length) {
    for (let word in counter) {
      console.info(word, ':', counter[word])
    }
  }
}

function countWord (text) {
  var words = text
    .toString()
    .toLowerCase()
    .split(/\W+/)
    .sort()

  for (let word of words) {
    counter[word] = (counter[word] || 0) + 1
  }
}

const fsDir = './'

fs.readdir(fsDir, function (err, files) {
  if (err) throw err
  for (let file of files) {
    if (file === 'index.js') {
      continue
    }
    const task = (function (file) {
      return function () {
        fs.readFile(fsDir + file, function(err, data) {
          countWord(data)
          ifComplete()
        })
      }
    })(file)

    tasks.push(task)
  }

  for (let task in tasks) {
    tasks[task]()
  }
})