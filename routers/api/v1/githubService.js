const https = require('https');
const guzzle = require('./guzzleJsonStream');

module.exports = {

  tradeCodeForToken(code) {
    const { GITHUB_ID: id, GITHUB_SECRET: secret } = process.env;
    return this.request({
      method: 'POST',
      hostname: 'github.com',
      path: `/login/oauth/access_token?code=${code}&client_id=${id}&client_secret=${secret}`,
      headers: {
        Accept: 'application/json',
      }
    });
  },

  getUserData(token) {
    return this.request({
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

  request({ body, ...config }) {
    body = JSON.stringify(body) || ''
    config.headers['Content-Length'] = Buffer.byteLength(body)

    return new Promise((resolve) => {
      https.request(config,
        (responseStream) => guzzle(responseStream).then(resolve)
      ).end(body)
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
