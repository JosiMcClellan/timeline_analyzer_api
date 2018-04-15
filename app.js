const express = require('express');
// const cookieParser = require('cookie-parser');

const app = express();

const userRouter = require('./routers/api/v1/userRouter')

app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

app.use('/api/v1/users', userRouter);
app.use((req, res) => {
  res.status(404).json({ error: `no route matches ${req.method} ${req.path}` });
})

module.exports = app;
