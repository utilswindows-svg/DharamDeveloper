const { Order, User } = require('../models');
const ApiError = require('../utils/ApiError');

function statusFor(order) {
  if (order.paymentStatus === 'refunded') return 'expired';
  if (order.expiresAt && new Date(order.expiresAt).getTime() < Date.now()) return 'expired';
  if (order.licenseName && /trial/i.test(order.licenseName)) return 'trial';
  return 'active';
}

// GET /api/user/admin/licenses
exports.listLicenses = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      where: { paymentStatus: ['paid', 'refunded'] },
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
      order: [['createdAt', 'DESC']],
      limit: 500,
    });
    const licenses = orders.map((o) => ({
      id: o.id,
      key: o.licenseKey || `ORD-${String(o.id).padStart(6, '0')}`,
      user: o.user?.name || `${o.firstName} ${o.lastName}`.trim(),
      email: o.user?.email || o.email,
      software: o.productTitle,
      productSlug: o.productSlug,
      licenseName: o.licenseName,
      seats: o.seats,
      systems: `0/${o.seats || 1}`,
      purchase: o.createdAt,
      expiry: o.expiresAt,
      total: Number(o.total) || 0,
      currency: o.currency,
      paymentStatus: o.paymentStatus,
      status: statusFor(o),
    }));
    res.json({ success: true, licenses });
  } catch (e) { next(e); }
};

// POST /api/user/admin/licenses/:id/revoke
exports.revokeLicense = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const order = await Order.findByPk(id);
    if (!order) throw new ApiError(404, 'License not found');
    order.paymentStatus = 'refunded';
    order.expiresAt = new Date();
    await order.save();
    res.json({ success: true, message: 'License revoked', id: order.id });
  } catch (e) { next(e); }
};
