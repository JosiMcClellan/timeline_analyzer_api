exports.up = function(knex, Promise) {
  return knex.schema.createTable('project_users', function (join) {
    join.primary(['projectId', 'userId'])
    join.string('projectId').references('projects.id')
    join.string('userId').references('users.id')
    join.timestamps(false, true)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('project_users')
};
