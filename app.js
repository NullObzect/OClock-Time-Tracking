const express = require('express');
const cookieParser = require('cookie-parser')
const env = require('dotenv')
const router = require('./routers/routes');
const { notFoundHandler, errorHandler } = require('./middleware/common/errorHandler');

env.config()
const app = express();

app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// cookie parser
app.use(cookieParser(process.env.COOKIE_SECRET))

app.use(router);

// 404 not found
app.use(notFoundHandler)

// error handling
app.use(errorHandler)

// server
app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server Running ${process.env.PORT}`);
});
