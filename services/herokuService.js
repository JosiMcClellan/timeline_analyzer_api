const fetchHttpsJson = require('./fetchHttpsJson');
const makeFilter = require('../utils/makeFilter');

const rawDeployFilter = makeFilter('status', 'created_at', 'id');

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
    });
  },

  freshAccessToken(user) {
    const { id, herokuAccess, herokuRefresh, herokuExpiry } = user;
    if (herokuExpiry > Date.now()) return herokuAccess;
    const { access, expiry } = this.refresh(herokuRefresh);
    usersTable.update(id, { herokuAccess: access, herokuRefresh: refresh })
      .then(updated => { if (!updated) console.warn('failed to update heroku access') })
    return access;
  },

  tradeCodeForTokens(code) {
    return this.getAccessTokens('authorization_code', 'code', code);
  },

  refresh(refreshToken) {
    return this.getAccessTokens('refresh_token', 'refresh_token', refreshToken);
  },

  async getDeploys(project, user) {
    const { herokuSlug: slug, herokuOwnerId: ownerId } = project;
    if (!slug) return [];
    let owner = user;
    if (user.id !== ownerId) owner = await usersTable.first(ownerId);
    if (!owner) throw 404;
    const token = this.freshAccessToken(owner)
    return fetchHttpsJson({
      hostname: 'api.heroku.com',
      path: `/apps/${slug}/builds`,
      headers: {
        Accept: 'application/vnd.heroku+json; version=3',
        Authorization: `Bearer ${token}`,
      }
    }).then(deploys => deploys.map(rawDeployFilter));
  }
}
