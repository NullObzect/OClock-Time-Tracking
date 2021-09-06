const express = require('express');
const cookieParser = require('cookie-parser')
const router = require('./routers/routes');
require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);
app.listen(process.env.PORT, () => {
  console.log(`Server Running ${process.env.PORT}`);
});
