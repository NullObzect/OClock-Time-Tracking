const express = require('express');

const app = express();
const cookieParser = require('cookie-parser')
const env = require('dotenv')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')
const router = require('./routers/routes');
const dbConnect = require('./config/database')
// for passport facebook congif/passportFB
require('./utilities/passportFB')(passport)
//
const { notFoundHandler, errorHandler } = require('./middleware/common/errorHandler');
const { checkUser } = require('./middleware/common/AuthMiddleware')

env.config()
app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// cookie parser
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(session({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true },
}))
app.use(passport.initialize());
app.use(passport.session());
// Check User
app.use(checkUser)

app.use(router);

// 404 not found
app.use(notFoundHandler)

// error handling
app.use(errorHandler)

// server
app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  const onlyGroupbyNull = 'SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,"ONLY_FULL_GROUP_BY",""))';
  dbConnect.promise().execute(onlyGroupbyNull)
  console.log(`Server Running http://localhost:${process.env.PORT}`);
});
