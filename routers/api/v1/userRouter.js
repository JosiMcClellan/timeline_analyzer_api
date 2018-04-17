const express = require('express');
const router = express.Router();

const userTable = require('../../../tables/userTable');
const filter = require('./filterParams')(
  'name',
  'email',
  'avatarUrl',
  'githubId',
  'githubAccessToken',
  'githubRefreshToken',
  'herokuAccessToken',
  'herokuRefreshToken',
);

router.post('/', async(req, res) => {
  const params = filter(req.body);
  let user = await userTable.find(params.githubId);
  if (!user) user = await userTable.create(params);
  res.status(200).json(user);
})

module.exports = router
