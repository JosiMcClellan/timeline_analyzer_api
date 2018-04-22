var table = require('./table')

const projectsTable = {
  create(params) {
    return table('projects').insert(params).returning('*').then(stuff => stuff[0]);
  },

  findBy(column, value) {
    return table('projects').where(`projects.${column}`, value)
      .leftJoin('project_users', 'projects.id', 'project_users.projectId')
      .leftJoin('users', 'users.id', 'project_users.userId')
      .groupBy('projects.id')
      .first(['projects.*', this.usersArray()])
  },

  usersArray() {
    return table.raw(`
      ARRAY_TO_JSON(
        ARRAY_REMOVE(
          ARRAY_AGG(users.*)
        , NULL)
      ) AS users
    `)
  }

}

module.exports = projectsTable
