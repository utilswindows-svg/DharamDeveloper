const { verifyAccess } = require('../utils/jwt');
const ApiError = require('../utils/ApiError');
module.exports = (req, _res, next) => {
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) throw new ApiError(401, 'Missing or invalid Authorization header');
    const decoded = verifyAccess(header.slice(7));
    req.user = { id: decoded.sub, email: decoded.email, role: decoded.role || 'user' };
    next();
  } catch (err) { next(new ApiError(401, 'Unauthorized: ' + (err.message || 'invalid token'))); }
};

module.exports.requireRole = (...roles) => (req, _res, next) => {
  if (!req.user) return next(new ApiError(401, 'Unauthorized'));
  if (!roles.includes(req.user.role)) return next(new ApiError(403, 'Forbidden'));
  next();
};
