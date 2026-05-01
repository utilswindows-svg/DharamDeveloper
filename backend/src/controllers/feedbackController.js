const Feedback = require("../models/Feedback");
const { Op } = require("sequelize");

/**
 * POST /api/feedback   (PUBLIC)
 * Create a new feedback entry.
 */
exports.createFeedback = async (req, res, next) => {
  try {
    const { name, email, product, rating, message } = req.body;
    const feedback = await Feedback.create({
      name,
      email: email.toLowerCase(),
      product: product || null,
      rating: rating ?? 5,
      message,
      status: "pending",
      ipAddress: req.ip,
    });

    return res.status(201).json({
      success: true,
      message: "Thank you! Your feedback has been received.",
      data: { id: feedback.id, createdAt: feedback.createdAt },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/feedback   (ADMIN)
 * Paginated list with filters: status, product, search.
 */
exports.listFeedback = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = (page - 1) * limit;

    const where = {};
    if (req.query.status) where.status = req.query.status;
    if (req.query.product) where.product = req.query.product;
    if (req.query.search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${req.query.search}%` } },
        { email: { [Op.like]: `%${req.query.search}%` } },
        { message: { [Op.like]: `%${req.query.search}%` } },
      ];
    }

    const { rows, count } = await Feedback.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/feedback/:id   (ADMIN)
 */
exports.getFeedback = async (req, res, next) => {
  try {
    const item = await Feedback.findByPk(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/feedback/:id/status   (ADMIN)
 */
exports.updateStatus = async (req, res, next) => {
  try {
    const item = await Feedback.findByPk(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Not found" });
    item.status = req.body.status;
    await item.save();
    res.json({ success: true, message: "Status updated", data: item });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/feedback/:id   (ADMIN)
 */
exports.deleteFeedback = async (req, res, next) => {
  try {
    const item = await Feedback.findByPk(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Not found" });
    await item.destroy();
    res.json({ success: true, message: "Feedback deleted" });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/feedback/stats   (ADMIN)
 * Returns counts + average rating.
 */
exports.getStats = async (req, res, next) => {
  try {
    const [total, pending, approved, rejected] = await Promise.all([
      Feedback.count(),
      Feedback.count({ where: { status: "pending" } }),
      Feedback.count({ where: { status: "approved" } }),
      Feedback.count({ where: { status: "rejected" } }),
    ]);
    const avg = await Feedback.findOne({
      attributes: [
        [Feedback.sequelize.fn("AVG", Feedback.sequelize.col("rating")), "avgRating"],
      ],
      raw: true,
    });
    res.json({
      success: true,
      data: {
        total,
        pending,
        approved,
        rejected,
        averageRating: Number(avg?.avgRating || 0).toFixed(2),
      },
    });
  } catch (err) {
    next(err);
  }
};