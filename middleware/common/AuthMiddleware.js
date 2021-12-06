const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const createError = require('http-errors')
const UserModel = require('../../models/UserModel')

dotenv.config()

const checkLogin = (req, res, next) => {
  const cookies = Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null
  if (cookies) {
    try {
      const token = cookies[process.env.COOKIE_NAME]
      const { userObject } = jwt.verify(token, process.env.JWT_SECRET)
      req.user = userObject
      if (res.locals.html) {
        res.locals.loggedInUser = userObject
      }
      next()
    } catch (err) {
      if (res.locals.html) {
        res.redirect('/');
      } else {
        res.status(500).json({
          errors: {
            common: {
              msg: 'Authentication failure!',
            },
          },
        });
      }
    }
  } else if (res.locals.html) {
    res.redirect('/');
  } else {
    res.status(401).json({
      errors: {
        common: {
          msg: 'Authentication failure!',
        },
      },
    });
  }
}

const checkUser = (req, res, next) => {
  const token = req.signedCookies[process.env.COOKIE_NAME];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        req.user = null;
        next();
      } else {
        const { userObject } = decodedToken
        const [user] = await UserModel.findUserByEmail(userObject.userMailFormDB);
        req.user = user
        next();
      }
    });
  } else {
    req.user = null;
    next();
  }
}

const redirectLoggedIn = (req, res, next) => {
  const cookie = req.signedCookies[process.env.COOKIE_NAME]
  if (!cookie) {
    next()
  } else {
    res.redirect('/dashboard');
  }
}

function requireRole(role) {
  return function (req, res, next) {
    if (req.user.userRole && role.includes(req.user.userRole)) {
      next();
    } else if (req.user.userRole && req.user.userRole === 'user') {
      next(createError(404, 'Page not found!'));
    } else if (res.locals.html) {
      next(createError(401, 'You are not authorized to access this page!'));
    } else {
      res.status(401).json({
        errors: {
          common: {
            msg: 'You are not authorized!',
          },
        },
      });
    }
  };
}

module.exports = {
  checkLogin, redirectLoggedIn, requireRole, checkUser,
}
