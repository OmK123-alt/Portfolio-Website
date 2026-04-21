import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'portfolio-secret-key-change-in-production';

export function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
}

export function generateToken(email) {
  return jwt.sign({ email, role: 'admin' }, SECRET, { expiresIn: '24h' });
}
