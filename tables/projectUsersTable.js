var table = require('./table')

const projectUsersTable = {
  create(projectId, userId) {
    return table('project_users').insert({ projectId, userId }).returning('*').then(stuff => stuff[0]);
  },

  find(projectId, userId) {
    return table('project_users').where({ projectId, userId })
  }
}

module.exports = projectUsersTable
