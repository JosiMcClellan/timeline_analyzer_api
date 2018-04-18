exports.up = function(knex, Promise) {
  return knex.schema.createTable('projects', function (projects) {
    projects.string('id').notNullable().primary()
    projects.string('name').notNullable()
    projects.boolean('hasTravis').defaultTo(false)
    projects.string('herokuSlug')
    projects.timestamps(false, true)
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('projects')
};
