const express = require('express');
const router = require('./routers/routes');
require('dotenv').config();

const app = express();

app.use(express.static(`${__dirname}/public`));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);
app.listen(process.env.PORT, () => {
  console.log(`Server Running ${process.env.PORT}`);
});
