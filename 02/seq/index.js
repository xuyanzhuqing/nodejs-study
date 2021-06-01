const fs = require('fs')
const Hash = require('hashish')
const Seq = require('seq')

Seq()
  .seq(function () {
    fs.readdir(__dirname, this)
  })
  .flatten(false)
  .parEach(function (file) {
    fs.stat(__dirname + '/' + file, this.into(file))
  })
  .seq(function (files) {
    const sizes = Hash.map(this.vars, c => c.size)
    console.dir(sizes)
  })