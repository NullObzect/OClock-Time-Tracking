function notFoundHandler(req, res) {
  res.status(404);
  // respond with html page
  if (req.accepts('html')) {
    res.render('pages/404', { url: req.url });
    return;
  }
  // respond with json
  if (req.accepts('json')) {
    res.json({ error: 'Not found' });
  }
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  res.locals.error = process.env.NODE_ENV === 'development' ? err : { message: err.message }
  res.status(err.status || 500)
  if (res.locals.html) {
    res.render('pages/404', { title: 'error page' })
  } else {
    res.json(res.locals.error)
  }
}

module.exports = { notFoundHandler, errorHandler }
