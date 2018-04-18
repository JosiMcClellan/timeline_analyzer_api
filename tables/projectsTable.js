var table = require('./table')

const projectsTable = {
  create(userId, params) {
    return table.transaction(step => {
      return step('projects').insert(params).returning('*')
        .then(project => {
          step('project_users').insert({ userId, projectId: project.id });
          return project;
        });
    });
  }
}
  // ANOTHER FORM IF THAT DOESN'T WORK
  // create(userId, params) {
  //   table.transaction(trx => (
  //     table('projects').insert(params).transacting(trx).returning('*')
  //       .then(project => {
  //         table('project_users').insert({userId, project.id }).transacting(trx)
  //         return project
  //       })
  //       .then(trx.commit)
  //       .catch(trx.rollback)
  //   ))
  // },

module.exports = projectsTable
