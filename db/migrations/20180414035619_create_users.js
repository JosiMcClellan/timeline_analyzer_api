exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function (users) {
    users.increments()
    users.timestamps(false, true)
    users.string('name').notNullable()
    users.string('email').notNullable()
    users.string('avatarUrl').notNullable()
    users.string('githubId').notNullable()
    users.string('githubAccessToken').notNullable()
    users.text('githubRefreshToken').notNullable()
    users.string('herokuAccessToken')
    users.string('herokuRefreshToken')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('projects')
};
