const pg = require('pg')

const client = new pg.Client({
  user: 'dbuser',
  password: 'dbuser',
  database: 'exampledb',
  port: '5432',
  host: 'localhost'
})

client.connect(function (err, client, done) {
  if (err) {
    console.info('connect error')
    client.end()
    return
  }
  console.info('connect successfully...')
  client.query('INSERT INTO user_list (name, age) VALUES ($1, $2)', ['ann', 18], function (err, result) {
    client.end()
    if (err) {
      throw err
    }
    console.info('insert successfully')
  })
})
