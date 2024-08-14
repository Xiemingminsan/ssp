// auth.js
import jwt from 'jsonwebtoken';

export default async function authenticate(req) {
  const authHeader = req.headers?.authorization || req.headers?.get('authorization');

  if (!authHeader) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { userId: decoded.userId, role: decoded.role };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}
