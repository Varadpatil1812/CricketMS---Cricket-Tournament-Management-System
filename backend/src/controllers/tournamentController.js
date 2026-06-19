import { pool } from '../config/db.js';

export const createTournament = async (req, res) => {

  const { name, format } = req.body;

  if (!name) 
    return res.status(400).json({ message: 'Tournament name required.' });

  try {
    const [r] = await pool.query('INSERT INTO tournaments (name,format) VALUES (?,?)', [name, format||'League']);
    return res.status(201).json({ message: 'Tournament created.', tournamentId: r.insertId });

  } 
  catch(e) 
  { 
    return res.status(500).json({ message: 'Somthing went wrong.' }); 
  }
};

export const getTournaments = async (req, res) => {

  try {
    const [rows] = await pool.query('SELECT * FROM tournaments ORDER BY created_at DESC');
    return res.status(200).json(rows);

  } 
  catch(e) 
  { 
    return res.status(500).json({ message: 'Somthing went wrong.' }); 
  }
};

export const addTeams = async (req, res) => {
  const { id } = req.params;

  const { team_ids } = req.body;

  if (!Array.isArray(team_ids) || team_ids.length < 2)
    return res.status(400).json({ message: 'Provide at least 2 team_ids.' });

  try {
    const [t] = await pool.query('SELECT id FROM tournaments WHERE id=?', [id]);

    if (!t.length) return res.status(404).json({ message: 'Tournament not found.' });

    await pool.query('UPDATE tournaments SET team_ids=? WHERE id=?', [JSON.stringify(team_ids), id]);

    return res.status(200).json({ message: 'Teams assigned.' });

  } 
  catch(e) 
  { 
    return res.status(500).json({ message: 'Somthing went wrong.' }); 
  }
};

export const getTournamentTeams = async (req, res) => {

  const { id } = req.params;

  try {
    const [rows] = await pool.query('SELECT team_ids FROM tournaments WHERE id=?', [id]);

    if (!rows.length) 
      return res.status(404).json({ message: 'Tournament not found.' });

    const ids = rows[0].team_ids || [];

    if (!ids.length) 
      return res.status(200).json([]);

    const [teams] = await pool.query(
      'SELECT t.id, t.name, u.name AS captain_name FROM teams t LEFT JOIN users u ON t.captain_id=u.id WHERE t.id IN (?)',
      [ids]
    );
    return res.status(200).json(teams);

  } 
  catch(e) 
  { 
    return res.status(500).json({ message: 'Somthing went wrong.' }); 
  }
};

