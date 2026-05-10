const { Download, Order } = require('../models');
const ApiError = require('../utils/ApiError');

function pickVersion(slug) {
  // Could be replaced with a product registry; static for now.
  const map = {
    'mbox-to-pdf': 'v2.5.1',
    'msg-to-pdf': 'v2.1.0',
    'pst-migration': 'v3.0.0',
    'msg-migration': 'v1.8.0',
    'data-recovery': 'v1.5.0',
    'pc-optimizer': 'v2.0.0',
    'pdf-tools': 'v1.2.0',
  };
  return map[slug] || 'v1.0.0';
}

// GET /api/user/downloads — active licenses (paid orders) the user can download
exports.listDownloads = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id, paymentStatus: 'paid' },
      order: [['createdAt', 'DESC']],
    });
    const now = Date.now();
    const downloads = orders.map((o) => {
      const exp = o.expiresAt ? new Date(o.expiresAt).getTime() : null;
      const status = exp && exp < now ? 'expired' : 'active';
      return {
        id: o.id,
        orderId: o.id,
        name: o.productTitle,
        productSlug: o.productSlug,
        version: pickVersion(o.productSlug),
        purchaseDate: o.createdAt,
        expiryDate: o.expiresAt,
        status,
        downloadUrl: `/api/user/downloads/${o.id}/file`,
      };
    });
    res.json({ success: true, downloads });
  } catch (e) { next(e); }
};

// GET /api/user/downloads/history — date-wise log of every file downloaded
exports.listHistory = async (req, res, next) => {
  try {
    const rows = await Download.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: 200,
    });
    const history = rows.map((d) => ({
      id: d.id,
      fileName: d.fileName,
      product: d.productTitle,
      productSlug: d.productSlug,
      version: d.version,
      size: d.fileSize,
      device: d.device,
      createdAt: d.createdAt,
    }));
    res.json({ success: true, history });
  } catch (e) { next(e); }
};

// POST /api/user/downloads/:orderId/record — record a download event
exports.recordDownload = async (req, res, next) => {
  try {
    const orderId = Number(req.params.orderId);
    const order = await Order.findOne({ where: { id: orderId, userId: req.user.id } });
    if (!order) throw new ApiError(404, 'Order not found');
    if (order.paymentStatus !== 'paid') throw new ApiError(403, 'Order is not paid');

    const version = pickVersion(order.productSlug);
    const baseName = order.productTitle.replace(/\s+/g, '');
    const fileName = req.body?.fileName || `${baseName}-${version}.exe`;
    const fileSize = req.body?.fileSize || `${(35 + Math.random() * 15).toFixed(1)} MB`;
    const ua = req.headers['user-agent'] || '';
    let device = req.body?.device;
    if (!device) {
      if (/Windows NT 10/.test(ua)) device = 'Windows 10/11 PC';
      else if (/Mac OS X/.test(ua)) device = 'macOS';
      else if (/Linux/.test(ua)) device = 'Linux';
      else device = 'Unknown Device';
    }

    const row = await Download.create({
      userId: req.user.id,
      orderId: order.id,
      productSlug: order.productSlug,
      productTitle: order.productTitle,
      version,
      fileName,
      fileSize,
      device,
      ipAddress: req.ip,
    });
    res.status(201).json({ success: true, download: row });
  } catch (e) { next(e); }
};