
exports.up = knex => knex.schema.createTable('bets', (table) => {
  table.increments();
  table.integer('match_id')
    .notNullable()
    .references('id')
    .inTable('matches');
  table.boolean('home');
  table.integer('amount');
  table.timestamps();
});

exports.down = knex => knex.schema.dropTableIfExists('bets');
