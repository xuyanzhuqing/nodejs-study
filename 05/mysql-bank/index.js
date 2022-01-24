// 一个待办列表
const http = require('http')
const work = require('./lib/timetrack')
const mysql = require('mysql')

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'timetrack'
})

const server = http.createServer(function (req, res) {
  switch (req.method) {
    case 'POST':
        switch (req.url) {
          case '/':
            work.add(db, req, res)
            break
          case '/archive':
            work.archive(db, req, res)
           break
          case '/delete':
            work.delete(db, req, res)
            break
          default: work.notFound(res)
        }
      break
    case 'GET':
      switch (req.url) {
        case '/':
          work.show(db, res)
          break
        case '/archived':
          work.showArchived(db, res)
          break
        default: work.notFound(res)
      }
      break
    default: work.notSupport(res)
  }
})

db.query(
  `
    CREATE TABLE IF NOT EXISTS work (
      id INT(10) NOT NULL AUTO_INCREMENT,
      hours DECIMAL(5,2) DEFAULT 0,
      date DATE,
      archived INT(1) DEFAULT 0,
      description LONGTEXT,
      PRIMARY KEY(id)
    )
  `,
  function (err) {
    if (err) throw err
    console.log('server is started...')
    server.listen(3000, 'localhost')
  }
)