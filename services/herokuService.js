const fetchHttpsJson = require('./fetchHttpsJson');
const makeFilter = require('../utils/makeFilter');
const users = require('../tables/usersTable');

module.exports = {
  getAccessTokens(grantType, grantField, grant) {
    const { HEROKU_SECRET: secret } = process.env;
    return fetchHttpsJson({
      method: 'POST',
      hostname: 'id.heroku.com',
      path: `/oauth/token?grant_type=${grantType}&${grantField}=${grant}&client_secret=${secret}`,
      headers: {
        Accept: 'application/json',
      },
    }).then(this.cleanTokens);
  },

  cleanTokens(raw) {
    const milliseconds = (raw.expires_in - 60) * 1000;
    return {
      herokuAccess: raw.access_token,
      herokuRefresh: raw.refresh_token,
      herokuExpiry: Date.now() + milliseconds
    };
  },

  async freshAccessToken(user) {
    if (user.herokuExpiry > Date.now()) return user.herokuAccess;
    const fresh = await this.refresh(user.herokuRefresh);
    if (fresh.message) throw fresh.message;
    users.update(user.id, fresh)
      .then(updated => updated || console.warn('failed to update heroku access'))
    return fresh;
  },

  tradeCodeForTokens(code) {
    return this.getAccessTokens('authorization_code', 'code', code);
  },

  refresh(refreshToken) {
    return this.getAccessTokens('refresh_token', 'refresh_token', refreshToken);
  },

  async getDeploys(project, user) {
    const { herokuOwnerId, herokuSlug } = project;
    if (!herokuSlug) return [];
    let owner = user;
    if (user.id !== herokuOwnerId) owner = await usersTable.first(ownerId);
    if (!owner) throw 404;
    const token = await this.freshAccessToken(owner)
    return fetchHttpsJson({
      hostname: 'api.heroku.com',
      path: `/apps/${herokuSlug}/builds`,
      headers: {
        Accept: 'application/vnd.heroku+json; version=3',
        Authorization: `Bearer ${token}`,
      }
    }).then(deploys => deploys.map && deploys.map(this.cleanDeploy));
  },

  cleanDeploy: makeFilter('status', 'created_at', 'id')
}
