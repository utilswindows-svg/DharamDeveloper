const router = require('express').Router();
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');
const { profile, updateProfile, getSettings, updateSettings, changePassword, request2FAOtp, verify2FA } = require('../controllers/userController');
const {
  createBillingOrder,
  createPaypalOrder,
  capturePaypalOrder,
  getOrder,
  listMyOrders,
} = require('../controllers/orderController');
const { listDownloads, listHistory, recordDownload, adminListDownloads } = require('../controllers/downloadController');

router.get('/profile', auth, profile);
router.put('/profile', auth, updateProfile);

// Settings
router.get('/settings', auth, getSettings);
router.put('/settings', auth, updateSettings);
router.post('/change-password', auth, changePassword);

// Two-Factor Authentication (email OTP)
router.post('/2fa/request-otp', auth, request2FAOtp);
router.post('/2fa/verify', auth, verify2FA);

// Orders
router.get('/orders', auth, listMyOrders);
router.post('/orders', optionalAuth, createBillingOrder);
router.get('/orders/:id', optionalAuth, getOrder);
router.post('/orders/:id/paypal/create', optionalAuth, createPaypalOrder);
router.post('/orders/:id/paypal/capture', optionalAuth, capturePaypalOrder);

// Downloads
router.get('/downloads', auth, listDownloads);
router.get('/downloads/history', auth, listHistory);
router.post('/downloads/:orderId/record', auth, recordDownload);

// Admin: full download log across all users
router.get('/admin/downloads', auth, requireRole('admin'), adminListDownloads);

module.exports = router;
