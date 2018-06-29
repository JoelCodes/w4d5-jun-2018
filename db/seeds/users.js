const bcrypt = require('bcrypt');

exports.seed = async (knex) => {
  // Delete Bets
  // Delete Users && Delete (Matches then Teams)

  await knex('bets').del();

  const delUsers = knex('users').del();
  const delMatchesThenTeams = (async () => {
    await knex('matches').del();
    await knex('teams').del();
  })();

  await delUsers;
  await delMatchesThenTeams;

  const createUsersP = knex('users')
    .returning('*')
    .insert([
      { email: 'evan@evan.evan', password_hash: bcrypt.hashSync('evan', 12) },
      { email: 'khoa@khoa.khoa', password_hash: bcrypt.hashSync('khoa', 12) },
      { email: 'vu@vu.vu', password_hash: bcrypt.hashSync('vu', 12) },
    ]);
  const createTeamsAndMatchesP = (async () => {
    const [france, argentina] = await knex('teams')
      .returning('*')
      .insert([{ name: 'France', flag_emoji: '🇫🇷' }, { name: 'Argentina', flag_emoji: '🇦🇷' }]);

    return knex('matches')
      .returning('*')
      .insert([{
        title: 'Round of 16',
        start: new Date(+(new Date()) + (1000 * 60 * 60 * 2)),
        home_team_id: france.id,
        away_team_id: argentina.id,
      }]);
  })();

  const [evan, khoa, kayla] = await createUsersP;
  const [match] = await createTeamsAndMatchesP;

  return knex('bets')
    .returning('*')
    .insert([
      {
        user_id: evan.id, home: true, amount: 20000, match_id: match.id,
      },
      {
        user_id: khoa.id, home: true, amount: 10000, match_id: match.id,
      },
      {
        user_id: kayla.id, home: false, amount: 10000, match_id: match.id,
      }]);
};
