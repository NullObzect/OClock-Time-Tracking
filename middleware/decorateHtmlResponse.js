function decorateHtmlResponse(pageTitle) {
  return (req, res, next) => {
    res.locals.html = true;
    res.locals.title = `${pageTitle} | OClock - Time Tracking`;
    res.locals.errors = {};
    res.locals.error = {};
    res.locals.value = {};
    res.locals.auth = false
    res.locals.registerFail = false;
    next();
  };
}
module.exports = decorateHtmlResponse;
