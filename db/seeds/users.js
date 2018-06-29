const bcrypt = require('bcrypt');

exports.seed = (knex, Promise) => {
  // Delete Bets
  // Delete Users && Delete (Matches then Teams)

  const delBetsPrms = knex('bets').del();
  const delAllDataPrms = delBetsPrms
    .then(() => {
      const delUsers = knex('users').del();
      const delMatches = knex('matches').del();
      const delMatchesThenTeams = delMatches
        .then(() => {
          const delTeams = knex('teams').del();
          return delTeams;
        });
      const delUsersMatchesAndTeams = Promise.all([delUsers, delMatchesThenTeams]);
      return delUsersMatchesAndTeams;
    });
  return delAllDataPrms
    .then(() => {
      const createUsersP = knex('users')
        .returning('*')
        .insert([
          { email: 'evan@evan.evan', password_hash: bcrypt.hashSync('evan', 12) },
          { email: 'khoa@khoa.khoa', password_hash: bcrypt.hashSync('khoa', 12) },
          { email: 'vu@vu.vu', password_hash: bcrypt.hashSync('vu', 12) },
        ]);
      const createTeamsP = knex('teams')
        .returning('*')
        .insert([{ name: 'France', flag_emoji: '🇫🇷' }, { name: 'Argentina', flag_emoji: '🇦🇷' }]);
      const createTeamsAndMatchesP = createTeamsP
        .then((teams) => {
          const [france, argentina] = teams;
          const createMatches = knex('matches')
            .returning('*')
            .insert([{
              title: 'Round of 16',
              start: new Date(+(new Date()) + (1000 * 60 * 60 * 2)),
              home_team_id: france.id,
              away_team_id: argentina.id,
            }]);
          return createMatches;
        });
      return Promise.all([createUsersP, createTeamsAndMatchesP]);
    })
    .then(([[evan, khoa, kayla], [match]]) => knex('bets')
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
        }]));
};
