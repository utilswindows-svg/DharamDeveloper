const { User } = require('../models');
const ApiError = require('../utils/ApiError');
exports.profile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'phone', 'createdAt', 'updatedAt'],
    });
    if (!user) throw new ApiError(404, 'User not found');
    res.json({ success: true, user });
  } catch (e) { next(e); }
};
