exports.up = function(knex, Promise) {
  return knex.schema.createTable('projects', function (projects) {
    projects.string('id').notNullable().primary()
    projects.string('nameWithOwner').notNullable()
    projects.string('travisId')
    projects.string('herokuSlug')
    projects.string('herokuOwnerId')
    projects.timestamps(false, true)
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('projects')
};
