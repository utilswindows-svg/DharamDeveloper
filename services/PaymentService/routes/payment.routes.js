const router = require('express').Router();
const payments = require('../controllers/paymentController');

router.post('/create', payments.createPayment);
router.get('/status/:paymentId', payments.getPaymentStatus);
router.post('/webhook', payments.handleWebhook);

module.exports = router;
