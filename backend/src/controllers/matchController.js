import { pool } from '../config/db.js';

export const generateFixtures = async (req, res) => {
  const { tournamentId } = req.params;
  try {
    const [[tour]] = await pool.query('SELECT team_ids FROM tournaments WHERE id=?', [tournamentId]);
    if (!tour) return res.status(404).json({ message: 'Tournament not found.' });
    const ids = tour.team_ids || [];
    if (ids.length < 2) return res.status(400).json({ message: 'Add at least 2 teams first.' });
    const [ex] = await pool.query('SELECT id FROM matches WHERE tournament_id=?', [tournamentId]);
    if (ex.length) return res.status(409).json({ message: 'Fixtures already generated.' });
    const rows = [];
    for (let i = 0; i < ids.length; i++)
      for (let j = i + 1; j < ids.length; j++)
        rows.push([tournamentId, ids[i], ids[j], 'upcoming']);
    await pool.query('INSERT INTO matches (tournament_id,teamA_id,teamB_id,status) VALUES ?', [rows]);
    return res.status(201).json({ message: 'Fixtures generated.', count: rows.length });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
};

export const getByTournament = async (req, res) => {
  const { tournamentId } = req.params;
  try {
    const [rows] = await pool.query(`
      SELECT m.id, m.status, m.played_at,
             m.teamA_id, m.teamB_id, m.winner_id,
             m.teamA_runs, m.teamA_wickets, m.teamA_overs,
             m.teamB_runs, m.teamB_wickets, m.teamB_overs,
             tA.name AS teamA_name, tB.name AS teamB_name,
             w.name  AS winner_name
      FROM matches m
      JOIN  teams tA ON m.teamA_id = tA.id
      JOIN  teams tB ON m.teamB_id = tB.id
      LEFT JOIN teams w ON m.winner_id = w.id
      WHERE m.tournament_id=? ORDER BY m.id
    `, [tournamentId]);
    return res.status(200).json(rows);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
};

/*
  AUTO WINNER LOGIC
  ─────────────────────────────────────────
  Rules (in priority order):
  1. Higher runs  →  winner
  2. Equal runs + fewer wickets lost  →  winner  (e.g. 150/3 beats 150/6)
  3. Equal runs + equal wickets  →  TIE
  No manual winner_id — 100% automatic from scores.
*/
export const enterResult = async (req, res) => {
  const { matchId } = req.params;
  const {
    teamA_runs, teamA_wickets, teamA_overs,
    teamB_runs, teamB_wickets, teamB_overs,
  } = req.body;

  if (teamA_runs == null || teamB_runs == null)
    return res.status(400).json({ message: 'teamA_runs and teamB_runs are required.' });

  try {
    const [[match]] = await pool.query('SELECT * FROM matches WHERE id=?', [matchId]);
    if (!match) return res.status(404).json({ message: 'Match not found.' });
    if (match.status !== 'upcoming')
      return res.status(409).json({ message: 'Result already entered.' });

    const rA = parseInt(teamA_runs)  || 0;
    const rB = parseInt(teamB_runs)  || 0;
    const wA = parseInt(teamA_wickets ?? 0) || 0;
    const wB = parseInt(teamB_wickets ?? 0) || 0;

    let winnerId = null;
    let status   = 'tie';

    if (rA > rB) {
      winnerId = match.teamA_id; status = 'completed';
    } else if (rB > rA) {
      winnerId = match.teamB_id; status = 'completed';
    } else {
      // Equal runs → fewer wickets lost wins
      if (wA < wB)      { winnerId = match.teamA_id; status = 'completed'; }
      else if (wB < wA) { winnerId = match.teamB_id; status = 'completed'; }
      else              { winnerId = null; status = 'tie'; }
    }

    await pool.query(`
      UPDATE matches SET
        teamA_runs=?, teamA_wickets=?, teamA_overs=?,
        teamB_runs=?, teamB_wickets=?, teamB_overs=?,
        winner_id=?, status=?
      WHERE id=?
    `, [
      rA, wA, teamA_overs ? parseFloat(teamA_overs) : null,
      rB, wB, teamB_overs ? parseFloat(teamB_overs) : null,
      winnerId, status, matchId,
    ]);

    return res.status(200).json({ message: 'Result saved.', status, winnerId });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
};

export const getHistory = async (req, res) => {
  const { tournament_id } = req.query;
  let sql = `
    SELECT m.id, m.status, m.played_at,
           m.teamA_runs, m.teamA_wickets, m.teamA_overs,
           m.teamB_runs, m.teamB_wickets, m.teamB_overs,
           tA.name AS teamA_name, tB.name AS teamB_name,
           w.name  AS winner_name, t.name AS tournament_name
    FROM matches m
    JOIN  teams tA ON m.teamA_id = tA.id
    JOIN  teams tB ON m.teamB_id = tB.id
    LEFT JOIN teams w ON m.winner_id = w.id
    JOIN  tournaments t ON m.tournament_id = t.id
    WHERE m.status IN ('completed','tie')
  `;
  const params = [];
  if (tournament_id) { sql += ' AND m.tournament_id=?'; params.push(tournament_id); }
  sql += ' ORDER BY m.played_at DESC';
  try {
    const [rows] = await pool.query(sql, params);
    return res.status(200).json(rows);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
};

// Player's own team match history
export const getPlayerHistory = async (req, res) => {
  const { team_id, tournament_id } = req.query;
  if (!team_id) return res.status(400).json({ message: 'team_id required.' });
  let sql = `
    SELECT m.id, m.status, m.played_at,
           m.teamA_runs, m.teamA_wickets, m.teamA_overs,
           m.teamB_runs, m.teamB_wickets, m.teamB_overs,
           tA.name AS teamA_name, tB.name AS teamB_name,
           w.name  AS winner_name, t.name AS tournament_name
    FROM matches m
    JOIN  teams tA ON m.teamA_id = tA.id
    JOIN  teams tB ON m.teamB_id = tB.id
    LEFT JOIN teams w ON m.winner_id = w.id
    JOIN  tournaments t ON m.tournament_id = t.id
    WHERE m.status IN ('completed','tie')
      AND (m.teamA_id=? OR m.teamB_id=?)
  `;
  const params = [team_id, team_id];
  if (tournament_id) { sql += ' AND m.tournament_id=?'; params.push(tournament_id); }
  sql += ' ORDER BY m.played_at DESC';
  try {
    const [rows] = await pool.query(sql, params);
    return res.status(200).json(rows);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
};
