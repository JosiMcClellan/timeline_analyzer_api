var table = require('./table')

const projectUsersTable = {
  join(projectId, userId) {
    return table('project_users').insert({ projectId, userId }).returning('*').then(stuff => stuff[0]);
  }
}

module.exports = projectUsersTable
