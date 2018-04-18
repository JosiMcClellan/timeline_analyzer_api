const router = require('express').Router();
const github = require('./githubService');
const users = require('../../../tables/usersTable');

router.post('/', async(req, res) => {

  const { access_token } = await github.tradeCodeForToken(req.body.code);
  const raw = (await github.getUserData(access_token)).data.viewer;
  let { projects, ...user } = await users.findBy('id', raw.id);
  if (user) return res.status(200).json({ user, projects });

  raw.accessToken = access_token;
  user = await users.create(raw);
  if (user) return res.status(201).json({ user, projects: [] });

  next("couldn't find or create user")

});

module.exports = router
