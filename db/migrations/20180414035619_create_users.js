exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function (users) {
    users.string('id').notNullable().primary()
    users.string('name').notNullable()
    users.string('email').notNullable()
    users.string('avatarUrl').notNullable()
    users.timestamps(false, true)
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users')
};
