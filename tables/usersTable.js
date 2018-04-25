const table = require('./table');

const userTable = {
  create(params) {
    return table('users').insert(params).returning('*').then(stuff => stuff[0]);
  },

  update(id, fields) {
    return this.find(id).update(fields).returning('*').then(stuff => stuff[0]);
  },

  find(id) {
    return table('users').where('users.id', id)
  },

  first(id) {
    return this.find(id).first('*')
  },

  withProjects(id) {
    return this.find(id)
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
