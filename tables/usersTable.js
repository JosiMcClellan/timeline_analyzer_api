const table = require('./table');

const userTable = {
  create(params) {
    return table('users').insert(params).returning('*').then(stuff => stuff[0]);
  },

  findBy(column, value) {
    return table('users').where(`users.${column}`, value)
      .first(['users.*', this.projectsArray()])
      .leftJoin('project_users', 'users.id', 'project_users.userId')
      .leftJoin('projects', 'projects.id', 'project_users.projectId')
      .groupBy('users.id')
  },

  projectsArray() {
    return table.raw(`
      ARRAY_TO_JSON(
        ARRAY_REMOVE(
          ARRAY_AGG(projects.*)
        , NULL)
      ) AS projects
    `)
  }
}

module.exports = userTable;
