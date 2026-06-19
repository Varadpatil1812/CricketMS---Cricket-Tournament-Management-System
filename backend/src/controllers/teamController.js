import { pool } from '../config/db.js';

export const addTeam = async (req, res) => {

  const { name } = req.body;
  if (!name) 
    return res.status(400).json({ message: 'Team name required.' });

  try {
    const [r] = await pool.query('INSERT INTO teams (name) VALUES (?)', [name]);

    return res.status(201).json({ message: 'Team created.', teamId: r.insertId });

  } 
  catch(e) {

    if (e.code === 'ER_DUP_ENTRY') 
      return res.status(409).json({ message: 'Team name exists.' });
    
    return res.status(500).json({ message: 'Somthing went wrong.' });
  }
};

export const getTeams = async (req, res) => {
  
  try {
    const [rows] = await pool.query(`
      SELECT t.id, t.name, t.captain_id, u.name AS captain_name
      FROM teams t LEFT JOIN users u ON t.captain_id = u.id
      ORDER BY t.name
    `);
    return res.status(200).json(rows);
  } 
  catch(e) 
  { 
    return res.status(500).json({ message: 'Somthing went wrong.' }); 
  }
};

export const getTeamPlayers = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT id, name, player_role, is_captain FROM users WHERE team_id=? AND role="player"',
      [id]
    );

    return res.status(200).json(rows);

  } 
  catch(e) 
  { 
    return res.status(500).json({ message: 'Somthing went wrong.' }); 
  }
};

