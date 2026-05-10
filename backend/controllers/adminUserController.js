const { User, Order, Download } = require('../models');
const { fn, col, literal } = require('sequelize');
const ApiError = require('../utils/ApiError');

// GET /api/user/admin/users — list every user with download & purchase stats
exports.listUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'phone', 'role', 'provider', 'avatar', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: 500,
    });

    const ids = users.map((u) => u.id);
    if (ids.length === 0) {
      return res.json({ success: true, users: [] });
    }

    // Aggregate downloads per user
    const downloadStats = await Download.findAll({
      attributes: [
        'userId',
        [fn('COUNT', col('id')), 'count'],
        [fn('MAX', col('createdAt')), 'lastAt'],
      ],
      where: { userId: ids },
      group: ['userId'],
      raw: true,
    });
    const dlMap = Object.fromEntries(
      downloadStats.map((r) => [r.userId, { count: Number(r.count) || 0, lastAt: r.lastAt }]),
    );

    // Aggregate paid orders (purchases) per user
    const orderStats = await Order.findAll({
      attributes: [
        'userId',
        [fn('COUNT', col('id')), 'count'],
        [fn('COALESCE', fn('SUM', col('total')), 0), 'totalSpent'],
        [fn('MAX', col('createdAt')), 'lastAt'],
      ],
      where: { userId: ids, paymentStatus: 'paid' },
      group: ['userId'],
      raw: true,
    });
    const orderMap = Object.fromEntries(
      orderStats.map((r) => [
        r.userId,
        { count: Number(r.count) || 0, totalSpent: Number(r.totalSpent) || 0, lastAt: r.lastAt },
      ]),
    );

    const result = users.map((u) => {
      const dl = dlMap[u.id] || { count: 0, lastAt: null };
      const od = orderMap[u.id] || { count: 0, totalSpent: 0, lastAt: null };
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        provider: u.provider,
        avatar: u.avatar,
        joined: u.createdAt,
        status: 'active',
        downloads: dl.count,
        lastDownloadAt: dl.lastAt,
        purchases: od.count,
        totalSpent: od.totalSpent,
        lastPurchaseAt: od.lastAt,
        licenses: od.count,
      };
    });

    res.json({ success: true, users: result });
  } catch (e) { next(e); }
};

// GET /api/user/admin/users/:id — detail with orders & downloads
exports.getUserDetail = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const user = await User.findByPk(id, {
      attributes: ['id', 'name', 'email', 'phone', 'role', 'provider', 'avatar', 'createdAt'],
    });
    if (!user) throw new ApiError(404, 'User not found');

    const [orders, downloads] = await Promise.all([
      Order.findAll({ where: { userId: id }, order: [['createdAt', 'DESC']], limit: 100 }),
      Download.findAll({ where: { userId: id }, order: [['createdAt', 'DESC']], limit: 100 }),
    ]);

    res.json({ success: true, user, orders, downloads });
  } catch (e) { next(e); }
};
