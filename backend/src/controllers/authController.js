import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

const VALID_ROLES = ['batsman', 'bowler', 'all-rounder', 'wicket-keeper'];

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set in environment variables. Check your .env file.');
}

export const register = async (req, res) => {

  const { name, email, password, player_role } = req.body;

  if (!name || !email || !password || !player_role)
    return res.status(400).json({ message: 'name, email, password, player_role required.' });

  if (!VALID_ROLES.includes(player_role))
    return res.status(400).json({ message: 'Invalid player_role.' });

  try {
    const [ex] = await pool.query('SELECT id FROM users WHERE email=?', [email]);

    if (ex.length)
      return res.status(409).json({ message: 'Email already registered.' });

    const hash = await bcrypt.hash(password, 10);
    const [r] = await pool.query(
      'INSERT INTO users (name,email,password,role,player_role) VALUES (?,?,?,?,?)',
      [name, email, hash, 'player', player_role]
    );
    return res.status(201).json({ message: 'Registered.', userId: r.insertId });
  }
  catch (e) {
    return res.status(500).json({ message: 'Something went wrong.' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ message: 'Email & password required.' });

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email=?', [email]);

    if (!rows.length)
      return res.status(401).json({ message: 'Invalid credentials.' });

    const user = rows[0];

    if (!await bcrypt.compare(password, user.password))
      return res.status(401).json({ message: 'Invalid credentials.' });

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      message: 'Login successful.', token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, player_role: user.player_role }
    });
  } catch (e) {
    console.log(e);

    return res.status(500).json({ message: 'Something went wrong.' });
  }
};