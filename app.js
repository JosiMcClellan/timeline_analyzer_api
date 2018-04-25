const express = require('express');
const sessions = require('./controllers/sessionsController');
const users = require('./controllers/api/v1/usersController');
const projects = require('./controllers/api/v1/projectsController');

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  console.log(`
    ${req.method} ${req.path}
    ${JSON.stringify(req.body)}
  `);
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Content-Type', 'application/json');
  next();
});

// sessions
app.post('/auth', sessions.create);
app.use(sessions.authenticate);

// api
app.use('/api/v1/users', users);
app.use('/api/v1/projects', projects);

// 404
// app.use((req, res) => {
//   res.status(404).json({ error: `no route matches ${req.method} ${req.path}` });
// });

// app.use((err, req, res, next) => {
//   console.log(error);
//   next();
// })

module.exports = app;
