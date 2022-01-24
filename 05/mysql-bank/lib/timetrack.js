const { exitCode } = require('process')
const querystring = require('querystring')

exports.add = function (db, req, res) {
  exports.parseRequest(req, function ({ hours, date, description }) {
    db.query(
      'INSERT INTO work (hours, date, description) values (?, ?, ?)',
      [hours, date, description],
      function (err) {
        if (err) {
          throw err
        } else {
          exports.show(db, res)
        }
      }
    )
  })
}

exports.archive = function (db, req, res) {
  exports.parseRequest(req, function ({ id }) {
    db.query(
      'UPDATE work SET archived=1 WHERE id=?',
      [id],
      function (err) {
        if (err) {
          throw err
        } else {
          exports.show(db, res)
        }
      }
    )
  })
}

exports.delete = function (db, req, res) {
  exports.parseRequest(req, function ({ id }) {
    db.query(
      'DELETE FROM work WHERE id=?',
      [id],
      function (err) {
        if (err) {
          throw err
        } else {
          exports.show(db, res)
        }
      }
    )
  })
}

exports.show = function (db, res, showArchived = false) {
  db.query(
    `SELECT * FROM work WHERE
     archived=?
     ORDER BY date DESC
    `,
    [showArchived],
    function (err, rows) {
      if (err) throw err
      let html = showArchived ? '' : '<a href="/archived">Archived Work</a>'
      html += exports.toListHtml(rows)
      html += exports.workFormHtml()
      exports.sendHTML(res, html)
    }
  )
}

exports.showArchived = function (db, res) {
  exports.show(db, res, true)
}

exports.notSupport = function (res) {
  res.statusCode = 400
  res.end('Not Support Method\n')
}

exports.notFound = function (res) {
  res.statusCode = 404
  res.end('Not Found\n')
}

exports.sendHTML = function (res, body) {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/html')
  const html = `
    <html>
      <head><meta charset="utf-8"/></head>
      <body>${body}</body>
    </html>
  `

  res.setHeader('Content-Length', Buffer.byteLength(html))
  res.end(html)
}

exports.parseRequest = function (req, cb) {
  let body = ''
  req.setEncoding('utf8')
  req.on('data', function (chunk) {
    body += chunk
  })
  req.on('end', function () {
    cb(querystring.parse(body))
  })
}

exports.actionForm = function (id, path, label) {
  const html =  `
    <form action=${path} method="post">
      <input type="hidden" name="id" value="${id}"/>
      <input type="submit" value="${label}"/>
    </form>
  `
  return html
}

exports.workFormHtml = function () {
  const fields = [
    { name: 'date', label: 'Date (YYYY-MM-DD)' },
    { name: 'hours', label: 'Hours Worked', type: 'number' },
    { name: 'description', label: 'description', type: 'textarea'},
  ]
  const html =  `
    <form action="/" method="post">
      ${
        fields.map(({ label, name, type }) => {
          if (type === 'textarea') {
            return `<p>${label}:<br/><textarea name="${name}"></textarea></p>`
          }
          return `<p>${label}:<br/><input type="${type || 'input'}" name="${name}"/></p>`
        }).join('')
      }
      <input type="submit" value="提交"/>
    </form>
  `
  return html
}

exports.toListHtml = function (rows) {
  const html =  `
    <table>
      <thead>
        <tr>
          <th>hours</th>
          <th>date</th>
          <th>description</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${
          rows.map(({ hours, date, description, archived, id }) => {
            const archiveBtn = archived ? '' : `${exports.workArchiveForm(id)}` 
            return `
              <tr>
                <td>${hours}</td>
                <td>${exports.formatTime(date)}</td>
                <td>${description}</td>
                <td>${archiveBtn}</td>
                <td>${exports.workDeleteForm(id)}</td>
              </tr>
            `
          }).join('')
        }
      </tbody>
    </table>
  `
  return html
}

exports.workArchiveForm = function (id) {
  return exports.actionForm(id, '/archive', 'Archive')
}

exports.workDeleteForm = function (id) {
  return exports.actionForm(id, '/delete', 'Delete')
}

exports.getTimeFeature = (time = 0, prefix = true) => {
  const d = new Date(time)
  const all = {
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    date: d.getDate(),
    hour: d.getHours(),
    minute: d.getMinutes(),
    second: d.getSeconds(),
    milliseconds: d.getMilliseconds()
  }
  // 补位
  if (prefix) {
    for (const feature in all) {
      const tmp = all[feature]
      all[feature] = tmp < 10 ? '0' + tmp : tmp
    }
  }
  return all
}

exports.formatTime = function (time) {
  const { year, month, date, hour, minute, second } = exports.getTimeFeature(time, true)

  return [year, month, date].join('/') + ' ' + [hour, minute, second].join(':')
}