
exports.up = knex => knex.schema.createTable('teams', (table) => {
  table.increments();
  table.string('name');
  table.string('flag_emoji');
});

exports.down = knex => knex.schema.dropTable('teams');
