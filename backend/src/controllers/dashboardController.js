import { pool } from '../config/db.js';

export const getDashboard = async (req, res) => {
  const userId = req.user.id;
  try {
    const [[user]] = await pool.query('SELECT u.id,u.name,u.email,u.player_role,u.team_id,u.is_captain, t.name AS team_name FROM users u LEFT JOIN teams t ON u.team_id=t.id WHERE u.id=?', [userId]);
    if (!user) return res.status(404).json({ message: 'Not found.' });

    let stats = { played:0, wins:0, losses:0, ties:0 };
    if (user.team_id) {
      const [ms] = await pool.query(
        'SELECT winner_id,status,teamA_id,teamB_id FROM matches WHERE (teamA_id=? OR teamB_id=?) AND status IN ("completed","tie")',
        [user.team_id, user.team_id]
      );
      ms.forEach(m => {
        stats.played++;
        if (m.status==='tie') stats.ties++;
        else if (m.winner_id===user.team_id) stats.wins++;
        else stats.losses++;
      });
    }
    return res.status(200).json({
      profile: { 
        id:user.id, 
        name:user.name, 
        email:user.email, 
        player_role:user.player_role, 
        is_captain:user.is_captain 
      },
        team: user.team_id ? { id:user.team_id, name:user.team_name } : null,
        stats
    });
  } catch(e) 
  {
    return res.status(500).json({ message: 'Somthings went wrong.' }); 
  }
};
