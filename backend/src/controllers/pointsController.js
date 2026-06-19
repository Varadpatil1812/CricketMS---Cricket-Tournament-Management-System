import { pool } from '../config/db.js';

export const getPointsTable = async (req, res) => {
  const { tournamentId } = req.params;

  try {
    const [[tour]] = await pool.query('SELECT team_ids FROM tournaments WHERE id=?', [tournamentId]);
    if (!tour) 
      return res.status(404).json({ message: 'Not found.' });

    const ids = tour.team_ids || [];

    if (!ids.length) 
      return res.status(200).json([]);

    const [teams] = await pool.query('SELECT id, name FROM teams WHERE id IN (?)', [ids]);

    const [matches] = await pool.query(
      'SELECT teamA_id,teamB_id,winner_id,status FROM matches WHERE tournament_id=? AND status IN ("completed","tie")',
      [tournamentId]
    );

    const tbl = {};
    teams.forEach(t => { tbl[t.id] = { team_id:t.id, team_name:t.name, played:0, wins:0, losses:0, ties:0, points:0 }; });

    matches.forEach(m => {
      const a = tbl[m.teamA_id], b = tbl[m.teamB_id];

      if (a) a.played++; 
      if (b) b.played++;

      if (m.status === 'tie') {

        if (a) { 
          a.ties++; a.points++; 
        }
        if (b) { 
          b.ties++; b.points++; 
        }
      } 
      else {
        const loserId = m.winner_id === m.teamA_id ? m.teamB_id : m.teamA_id;

        if (tbl[m.winner_id]) { 
          tbl[m.winner_id].wins++; 
          tbl[m.winner_id].points += 2; 
        }
        if (tbl[loserId]) { 
          tbl[loserId].losses++; 
        }
      }
    });

    const sorted = Object.values(tbl).sort((a,b) => b.points !== a.points ? b.points-a.points : b.wins-a.wins);

    return res.status(200).json(sorted);

  } 
  catch(e) 
  { 
    return res.status(500).json({ message: 'Somthing went wrong.' }); 
  }
};
