const heroku = require('../../../services/herokuService');
const users = require('../../../tables/usersTable');

const router = require('express').Router();

router.patch('/heroku', (req, res, next) => {
  heroku.tradeCodeForTokens(req.body.code)
    .then(tokens => {
      const milliseconds = (tokens.expires_in - 60) * 1000
      return users.update(req.user.id, {
        herokuAccess: tokens.access_token,
        herokuRefresh: tokens.refresh_token,
        herokuExpiry: Date.now() + milliseconds
      })
    }).then(updated => {
      return updated
      ? res.status(201).json(updated)
      : next(422)
    })
    .catch(next);
});

module.exports = router;
