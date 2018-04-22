const express = require('express');
const authRouter = require('./routers/api/v1/authRouter')
const projectRouter = require('./routers/api/v1/projectRouter')

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Content-Type', 'application/json');
  next();
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/projects', projectRouter);
app.use((req, res) => {
  res.status(404).json({ error: `no route matches ${req.method} ${req.path}` });
});

app.use((err, req, res, next) => {
  console.log(error);
  next();
})

module.exports = app;
