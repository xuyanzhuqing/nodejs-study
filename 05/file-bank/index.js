const fs = require('fs')
const args = process.argv.slice(2)
const command = args.shift()
const path = require('path')

const file = path.join(__dirname, './tasks')

switch (command) {
  case '-add': add()
    break
  case '-list': list()
    break
  default:
    console.error('not support')
}

