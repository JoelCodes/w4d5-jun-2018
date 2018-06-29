
exports.up = knex => knex.schema.table('users', (table) => {
  table.dropColumn('name');
  table.string('email').notNullable().unique();
  table.string('password_hash').notNullable();
});

exports.down = knex => knex.schema.table('users', (table) => {
  table.dropColumn('email');
  table.dropColumn('password_hash');
  table.string('name');
});
