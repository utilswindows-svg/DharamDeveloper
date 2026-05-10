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

// PATCH /api/feedback/:id  (admin) — update status or message
exports.updateFeedback = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const fb = await Feedback.findByPk(id);
    if (!fb) throw new ApiError(404, 'Feedback not found');
    const { name, email, message, status } = req.body || {};
    if (name !== undefined) fb.name = String(name).trim();
    if (email !== undefined) fb.email = String(email).trim().toLowerCase();
    if (message !== undefined) fb.message = String(message).trim();
    if (status !== undefined) {
      if (!['new', 'read', 'archived'].includes(status)) throw new ApiError(400, 'Invalid status');
      fb.status = status;
    }
    await fb.save();
    res.json({ success: true, message: 'Feedback updated', feedback: fb });
  } catch (err) { next(err); }
};

// DELETE /api/feedback/:id  (admin)
exports.deleteFeedback = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const fb = await Feedback.findByPk(id);
    if (!fb) throw new ApiError(404, 'Feedback not found');
    await fb.destroy();
    res.json({ success: true, message: 'Feedback deleted', id });
  } catch (err) { next(err); }
};