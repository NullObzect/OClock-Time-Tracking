const createError = require('http-errors')

function notFoundHandler(req, res, next) {
  next(createError(404, 'Your requested content was not found!'))
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  res.locals.error = process.env.NODE_ENV === 'development' ? err : { message: err.message }
  res.status(err.status || 500)
  if (res.locals.html) {
    res.render('pages/error', { title: 'error page' })
  } else {
    res.json(res.locals.error)
  }
}

module.exports = { notFoundHandler, errorHandler }
