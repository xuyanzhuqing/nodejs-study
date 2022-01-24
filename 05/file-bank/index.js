const fs = require('fs')
const args = process.argv.slice(2)
const command = args.shift()
const path = require('path')

const file = path.join(__dirname, './.tasks')
const commandSummary = args.join(' ')

switch (command) {
  case '-add': add()
    break
  case '-list': list()
    break
  default:
    console.table([
      {
        action: '-add',
      },
      {
        action: '-list'
      }
    ])
}

function loadTask (cb) {
  fs.stat(file, function (err, stats) {
    if (err) {
      throw err
    } else {
      fs.readFile(file, function (err, data) {
        if (err) {
          cb([])
        } else {
          const obj = JSON.parse(data.toString() || '[]')
          cb(obj)
        }
      })
    }
  })
}

function add () {
  loadTask(function (tasks) {
    tasks.push(commandSummary)
    fs.writeFileSync(file, JSON.stringify(tasks, null, 2))
  })
}

function list () {
  loadTask(function (tasks) {
    tasks.forEach(task => {
      console.info(task)
    })
  })
}
