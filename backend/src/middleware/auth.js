import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set in environment variables. Check your .env file.');
}

export const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token)
    return res.status(401).json({ message: 'No token.' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  }
  catch {
    return res.status(403).json({ message: 'Invalid token.' });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin')
    return res.status(403).json({ message: 'Admins only.' });
  next();
};