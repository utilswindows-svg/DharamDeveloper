const { verifyAccess } = require('../utils/jwt');

// Attaches req.user if a valid Bearer token is present; otherwise continues silently.
module.exports = (req, _res, next) => {
  try {
    const header = req.headers.authorization || '';
    if (header.startsWith('Bearer ')) {
      const decoded = verifyAccess(header.slice(7));
      req.user = { id: decoded.sub, email: decoded.email, role: decoded.role || 'user' };
    }
  } catch (_) { /* ignore */ }
  next();
};