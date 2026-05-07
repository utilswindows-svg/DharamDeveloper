const { Feedback } = require('../models');
const ApiError = require('../utils/ApiError');

function validate(b) {
  if (!b.name || String(b.name).trim().length === 0) throw new ApiError(400, 'Name is required');
  if (String(b.name).length > 100) throw new ApiError(400, 'Name too long');
  if (!b.email || !/^\S+@\S+\.\S+$/.test(b.email)) throw new ApiError(400, 'Valid email is required');
  if (!b.message || String(b.message).trim().length === 0) throw new ApiError(400, 'Message is required');
  if (String(b.message).length > 2000) throw new ApiError(400, 'Message too long');
}

// POST /api/feedback  (public)
exports.createFeedback = async (req, res, next) => {
  try {
    const b = req.body || {};
    validate(b);
    const fb = await Feedback.create({
      userId: req.user?.id || null,
      name: String(b.name).trim(),
      email: String(b.email).trim().toLowerCase(),
      message: String(b.message).trim(),
    });
    res.status(201).json({ success: true, message: 'Feedback submitted. Thank you!', feedback: fb });
  } catch (err) { next(err); }
};

// GET /api/feedback  (admin)
exports.listFeedback = async (_req, res, next) => {
  try {
    const items = await Feedback.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ success: true, feedback: items });
  } catch (err) { next(err); }
};