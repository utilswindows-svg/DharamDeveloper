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

exports.updateProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) throw new ApiError(404, 'User not found');

    const { name, phone, avatar } = req.body || {};
    if (typeof name === 'string' && name.trim()) user.name = name.trim();
    if (typeof phone === 'string') user.phone = phone.trim() || null;
    if (typeof avatar === 'string') user.avatar = avatar.trim() || null;

    await user.save();
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (e) { next(e); }
};
