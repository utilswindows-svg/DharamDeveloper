const { Order } = require('../models');
const ApiError = require('../utils/ApiError');
const paypal = require('../services/paypalService');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { User } = require('../models');
const { issueTokens } = require('../services/tokenService');
const { sendLicenseEmail } = require('../services/emailService');

function genLicenseKey() {
  const seg = () => Math.random().toString(36).slice(2, 7).toUpperCase();
  return `${seg()}-${seg()}-${seg()}-${seg()}`;
}

function genTempPassword() {
  return crypto.randomBytes(9).toString('base64').replace(/[^A-Za-z0-9]/g, '').slice(0, 12) + 'A1!';
}

function validateBilling(b) {
  const required = ['firstName', 'lastName', 'email', 'country', 'zip',
    'productSlug', 'productTitle', 'licenseName', 'subtotal', 'total'];
  for (const k of required) {
    if (b[k] === undefined || b[k] === null || b[k] === '') {
      throw new ApiError(400, `Missing field: ${k}`);
    }
  }
  if (!/^\S+@\S+\.\S+$/.test(b.email)) throw new ApiError(400, 'Invalid email');
}

// POST /api/orders  — save billing info, create draft order
exports.createBillingOrder = async (req, res, next) => {
  try {
    const b = req.body || {};
    validateBilling(b);

    // Auto-create / link user account from billing email
    let user = req.user?.id ? await User.findByPk(req.user.id) : null;
    let createdAccount = false;
    let tempPassword = null;
    if (!user) {
      user = await User.findOne({ where: { email: b.email } });
    }
    if (!user) {
      tempPassword = genTempPassword();
      const hashed = await bcrypt.hash(tempPassword, 12);
      user = await User.create({
        name: `${b.firstName} ${b.lastName}`.trim(),
        email: b.email,
        phone: null,
        password: hashed,
        role: 'user',
        provider: 'local',
      });
      createdAccount = true;
    }

    const tokens = await issueTokens(user);

    const order = await Order.create({
      userId: user.id,
      productSlug: b.productSlug,
      productTitle: b.productTitle,
      licenseName: b.licenseName,
      licenseIndex: b.licenseIndex || 0,
      firstName: b.firstName,
      lastName: b.lastName,
      email: b.email,
      company: b.company || null,
      country: b.country,
      zip: b.zip,
      subtotal: b.subtotal,
      tax: b.tax || 0,
      total: b.total,
      currency: b.currency || 'USD',
      paymentMethod: 'paypal',
      paymentStatus: 'pending',
      seats: Number(b.seats) > 0 ? Number(b.seats) : 1,
    });
    res.status(201).json({
      success: true,
      order,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
      ...tokens,
      createdAccount,
      tempPassword: createdAccount ? tempPassword : undefined,
    });
  } catch (err) { next(err); }
};

// POST /api/orders/:id/paypal/create  — create PayPal order
exports.createPaypalOrder = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) throw new ApiError(404, 'Order not found');
    const pp = await paypal.createOrder({
      amount: order.total,
      currency: order.currency,
      reference: order.id,
    });
    order.paypalOrderId = pp.id;
    await order.save();
    res.json({ success: true, paypalOrderId: pp.id });
  } catch (err) { next(err); }
};

// POST /api/orders/:id/paypal/capture — capture after approval
exports.capturePaypalOrder = async (req, res, next) => {
  try {
    const { paypalOrderId } = req.body || {};
    const order = await Order.findByPk(req.params.id);
    if (!order) throw new ApiError(404, 'Order not found');
    if (!paypalOrderId) throw new ApiError(400, 'Missing paypalOrderId');
    const result = await paypal.captureOrder(paypalOrderId);
    const status = result?.status;
    const capture = result?.purchase_units?.[0]?.payments?.captures?.[0];
    if (status === 'COMPLETED') {
      order.paymentStatus = 'paid';
      order.paypalCaptureId = capture?.id || null;
      order.payerEmail = result?.payer?.email_address || null;
      if (!order.licenseKey) order.licenseKey = genLicenseKey();
      if (!order.expiresAt) {
        const exp = new Date();
        exp.setFullYear(exp.getFullYear() + 1);
        order.expiresAt = exp;
      }
      await order.save();
      // Send license key email (non-blocking on errors)
      try {
        await sendLicenseEmail({ to: order.email, order: order.toJSON() });
      } catch (mailErr) {
        console.error('License email failed:', mailErr.message);
      }
      return res.json({ success: true, order, paypal: result });
    }
    order.paymentStatus = 'failed';
    await order.save();
    res.status(400).json({ success: false, message: 'Payment not completed', paypal: result });
  } catch (err) { next(err); }
};

// GET /api/orders/:id
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) throw new ApiError(404, 'Order not found');
    res.json({ success: true, order });
  } catch (err) { next(err); }
};

// GET /api/orders — list current user orders
exports.listMyOrders = async (req, res, next) => {
  try {
    const where = req.user?.id ? { userId: req.user.id } : {};
    const orders = await Order.findAll({ where, order: [['createdAt', 'DESC']] });
    res.json({ success: true, orders });
  } catch (err) { next(err); }
};