const jwt = require('jsonwebtoken');
const github = require('../services/githubService');
const users = require('../tables/usersTable');
const makeFilter = require('../utils/makeFilter');

const renderUserFilter = makeFilter(
  'id', 'name', 'email', 'avatarUrl', 'hasHeroku'
)

const secret = process.env.TAAPI_SECRET;

module.exports = {
  async authenticate(req, res, next) {
    const token = req.get('Authorization');
    if (!token) return next();

    const { id } = jwt.verify(token, secret);
    req.user = await users.first(id);
    if (req.user) return next();
    next("no such user");
  },

  async create(req, res, next) {
    const { access_token } = await github.tradeCodeForToken(req.body.code);
    const { data, message } = await github.getUserData(access_token);
    if (message) return next(message);

    const raw = data.viewer;
    let status = 200, user = await users.withProjects(raw.id);
    if (!user) status = 201, user = await users.create(raw);
    if (!user) return next("couldn't find or create user");

    projects = user.projects || [];
    user.hasHeroku = !!user.herokuAccess;
    user = renderUserFilter(user);
    user.githubToken = access_token;
    user.taapiToken = jwt.sign({ id: user.id }, secret);

    res.status(status).json({ user, projects });
  }
}
