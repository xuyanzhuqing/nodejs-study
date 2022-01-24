function Router (options) {
  return function (req, res, next) {
    if (req.url === '/favicon.ico') {
      return next()
    }

    if (req.url !== '/') {
      console.info(req.url)
      const err = new Error('Not Found')
      err.code = 404
      next(err)
    } else {
      next()
    }
  }
}

module.exports = Router
