const fetchHttpsJson = require('./fetchHttpsJson');

module.exports = {
  tradeCodeForToken(code) {
    const { GITHUB_ID: id, GITHUB_SECRET: secret } = process.env;
    return fetchHttpsJson({
      method: 'POST',
      hostname: 'github.com',
      path: `/login/oauth/access_token?code=${code}&client_id=${id}&client_secret=${secret}`,
      headers: {
        Accept: 'application/json',
      }
    });
  },

  getUserData(token) {
    return fetchHttpsJson({
      method: 'POST',
      hostname: 'api.github.com',
      path: `/graphql`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'timeline-analyzer'
      },
      body: { query: this.userBasicDataQuery }
    });
  },

  userBasicDataQuery: `
    query userBasicDataQuery {
      viewer{
        id
        name
        email
    		avatarUrl
      }
    }
  `
}
