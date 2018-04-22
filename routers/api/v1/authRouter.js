const router = require('express').Router();
const github = require('./githubService');
const usersTable = require('../../../tables/usersTable');

router.post('/', async(req, res) => {

  // get the data
  const { access_token } = await github.tradeCodeForToken(req.body.code);
  const { data, message } = await github.getUserData(access_token);
  if (message) throw message;
  const raw = data.viewer;

  // check for existing user
  const found = await usersTable.findBy('id', raw.id);
  console.log({found})
  if (found) {
    const { projects, ...user } = found
    user.accessToken = access_token;
    return res.status(200).json({ user, projects });
  }

  // otherwise make a new one
  const created = await usersTable.create(raw);
  console.log({created})
  created.accessToken = access_token;
  return res.status(201).json({ user: created, projects: [] });

  // drat.
  next("couldn't find or create user")

});

module.exports = router
