const { verifyAccess } = require('../utils/jwt');
const ApiError = require('../utils/ApiError');
module.exports = (req, _res, next) => {
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) throw new ApiError(401, 'Missing or invalid Authorization header');
    const decoded = verifyAccess(header.slice(7));
    req.user = { id: decoded.sub, email: decoded.email };
    next();
  } catch (err) { next(new ApiError(401, 'Unauthorized: ' + (err.message || 'invalid token'))); }
};
