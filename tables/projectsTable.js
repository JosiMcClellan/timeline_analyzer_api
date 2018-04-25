const projectUsers = require('./projectUsersTable')
const table = require('./table')

const projectsTable = {
  create(params) {
    return table('projects').insert(params).returning('*').then(stuff => stuff[0]);
  },

  find(id) {
    return table('projects').where('projects.id', id)
  },

  first(id) {
    return this.find(id).first('*');
  },

  forUser(projectId, userId) {
    return this.first(projectId)
    .whereExists(projectUsers.find(projectId, userId))
  },

  update(id, fields) {
    return this.find(id).update(fields).returning('*').then(stuff => stuff[0]);
  },

  // withUsers(query) {
  //   return query
  //     .leftJoin('project_users', 'projects.id', 'project_users.projectId')
  //     .leftJoin('users', 'users.id', 'project_users.userId')
  //     .groupBy('projects.id')
  //     .first(['projects.*', this.usersArray()])
  // },

  // usersArray() {
  //   return table.raw(`
  //     ARRAY_TO_JSON(
  //       ARRAY_REMOVE(
  //         ARRAY_AGG(users.*)
  //       , NULL)
  //     ) AS users
  //   `)
  // }

}

module.exports = projectsTable
