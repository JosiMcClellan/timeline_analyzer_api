const heroku = require('../../../services/herokuService');
const users = require('../../../tables/usersTable');

const router = require('express').Router();

router.patch('/heroku', (req, res, next) => {
  heroku.tradeCodeForTokens(req.body.code)
    .then(tokens => users.update(req.user.id, tokens))
    .then(updated => {
      if (!updated) return next(422);
      res.status(204).json({});
    })
    .catch(next);
});

module.exports = router;
