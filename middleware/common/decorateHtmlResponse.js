const Flash = require('../../utilities/Flash')

function decorateHtmlResponse(pageTitle) {
  return (req, res, next) => {
    res.locals.html = true;
    res.locals.title = `${pageTitle} | OClock - Time Tracking`;
    res.locals.errors = {};
    res.locals.error = {};
    res.locals.data = {};
    res.locals.value = {};
    res.locals.auth = false
    res.locals.alert = {}
    res.locals.loggedInUser = {}
    res.locals.profile = {}
    res.locals.signIn = false
    res.locals.addUser = false
    res.locals.flashMessage = Flash.getMessage(req)
    res.locals.baseUrl = process.env.BASE_URL
    res.locals.google = process.env.GOOGLE_PASSPORT_CLIENT_ID
    res.locals.facebook = process.env.FACEBOOK_CLIENT_ID
    res.locals.startDate = ''
    res.locals.endDate = ''
    next();
  };
}
module.exports = decorateHtmlResponse;
