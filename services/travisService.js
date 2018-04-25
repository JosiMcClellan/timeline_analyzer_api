const fetchHttpsJson = require('./fetchHttpsJson');
const makeFilter = require('../utils/makeFilter')
const token = process.env.TRAVIS_TOKEN;

module.exports = {
  async getBuilds(project, _user) {
    const slug = project.nameWithOwner.replace('/', '%2F')
    return fetchHttpsJson({
      hostname: 'api.travis-ci.org',
      path: `/repo/${slug}/builds`,
      headers: {
        'Travis-API-Version': '3',
        Authorization: `token ${token}`
      }
    }).then(this.clean);
  },

  clean(data) {
    return data.builds.map(raw => ({
      id: raw.id,
      duration: raw.duration,
      timestamp: raw.started_at,
      status: raw.state,
      repoSlug: raw.repository.slug,
      branchName: raw.branch.name,
    }));
  },
}
