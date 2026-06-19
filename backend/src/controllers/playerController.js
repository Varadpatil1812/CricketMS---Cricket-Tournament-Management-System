import { pool } from '../config/db.js';

export const getPlayers = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT u.id, u.name, u.email, u.player_role, u.team_id, u.is_captain,
             t.name AS team_name
      FROM users u LEFT JOIN teams t ON u.team_id = t.id
      WHERE u.role='player' ORDER BY u.name
    `);
    return res.status(200).json(rows);
  } 
  catch(e) 
  { 
    return res.status(500).json({ message: 'Somthings went wrong.' }); 
  }
};

export const searchPlayer = async (req, res) => {
  const { q } = req.query;
  if (!q) 
    return res.status(400).json({ message: 'Query q required.' });

  try {
    const [rows] = await pool.query(`
      SELECT u.id, u.name, u.email, u.player_role, u.team_id, u.is_captain,
             t.name AS team_name
      FROM users u LEFT JOIN teams t ON u.team_id = t.id
      WHERE u.role='player' AND u.name LIKE ? ORDER BY u.name LIMIT 10
    `, [`%${q}%`]);

    return res.status(200).json(rows);
  } 
  catch(e) 
  { 
    return res.status(500).json({ message: 'Somthings went wrong.' }); }
};

export const assignPlayer = async (req, res) => {
  const { id } = req.params;
  const { team_id, assign_as } = req.body;

  if (!team_id) return res.status(400).json({ message: 'team_id required.' });
  if (!['captain', 'player'].includes(assign_as))
    return res.status(400).json({ message: 'assign_as must be "captain" or "player".' });

  try {
    const [[player]] = await pool.query('SELECT id FROM users WHERE id=? AND role="player"', [id]);
    if (!player) 
      return res.status(404).json({ message: 'Player not found.' });

    const [[team]] = await pool.query('SELECT id FROM teams WHERE id=?', [team_id]);
    if (!team) 
      return res.status(404).json({ message: 'Team not found.' });

    if (assign_as === 'captain') {

      await pool.query('UPDATE users SET is_captain=0 WHERE team_id=? AND is_captain=1', [team_id]);
      
      await pool.query('UPDATE users SET team_id=?, is_captain=1 WHERE id=?', [team_id, id]);
      
      await pool.query('UPDATE teams SET captain_id=? WHERE id=?', [id, team_id]);

      return res.status(200).json({ message: 'Player assigned as captain.' });

    } else {
      
      await pool.query('UPDATE users SET team_id=?, is_captain=0 WHERE id=?', [team_id, id]);

      return res.status(200).json({ message: 'Player assigned to team.' });
    }
  } 
  catch(e) 
  { 
    return res.status(500).json({ message: 'Somthings went wrong.' }); 
  }
};

