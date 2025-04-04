// Middleware/identifier.js
const jwt = require('jsonwebtoken');

const identifier = (roles = []) => async (req, res, next) => {
  let token = req.headers.authorization || req.cookies['Authorization'];
  if (!token) return res.status(403).json({ success: false, message: 'Unauthorized' });

  try {
    if (token.startsWith('Bearer ')) token = token.split(' ')[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userRoles = Array.isArray(decoded.roles) ? decoded.roles : [decoded.roles];
    if (roles.length && !roles.some(role => userRoles.includes(role))) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }
    req.user = decoded; // { userId, username, roles }
    next();
  } catch (error) {
    console.error('Token error:', error);
    return res.status(400).json({ success: false, message: 'Invalid token' });
  }
};

module.exports = identifier;