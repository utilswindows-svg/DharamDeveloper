const router = require('express').Router();
const auth = require('../middleware/auth');
const { profile } = require('../controllers/userController');
const {
  createBillingOrder,
  createPaypalOrder,
  capturePaypalOrder,
  getOrder,
  listMyOrders,
} = require('../controllers/orderController');

router.get('/profile', auth, profile);

// Orders
router.get('/orders', auth, listMyOrders);
router.post('/orders', auth, createBillingOrder);
router.get('/orders/:id', auth, getOrder);
router.post('/orders/:id/paypal/create', auth, createPaypalOrder);
router.post('/orders/:id/paypal/capture', auth, capturePaypalOrder);

module.exports = router;
