
exports.up = knex => knex.schema.createTable('matches', (table) => {
  table.increments();
  table.string('title');
  table.dateTime('start');
  table.integer('winner_team_id')
    .references('id').inTable('teams');
  table.integer('home_score');
  table.integer('away_score');
  table.integer('home_team_id')
    .notNullable()
    .references('id').inTable('teams');
  table.integer('away_team_id')
    .notNullable()
    .references('id').inTable('teams');
});

exports.down = knex => knex.schema.dropTable('matches');
