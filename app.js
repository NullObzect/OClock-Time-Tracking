const express = require('express');
const cookieParser = require('cookie-parser')
const env = require('dotenv')
const router = require('./routers/routes');
const { checkUser } = require('./middleware/AuthMiddleware');

env.config()
const app = express();

app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// check user for all URL
app.use('*', checkUser)

app.use(router);
// 404 page
app.use((req, res) => {
  res.send("<h1 class='text-center'> 404 not found 🎂</h1>");
});
// server
app.listen(process.env.PORT, () => {
  console.log(`Server Running ${process.env.PORT}`);
});
