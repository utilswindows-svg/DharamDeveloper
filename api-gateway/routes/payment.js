const express = require('express');
const { proxyRequest } = require('../middleware/proxy');

const router = express.Router();

router.post('/create', async (req, res, next) => {
  try {
    const result = await proxyRequest(
      'POST',
      '/api/payments/create',
      req.body,
      { 'X-Request-ID': req.id },
      process.env.PAYMENT_URL,
    );
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

router.get('/status/:paymentId', async (req, res, next) => {
  try {
    const result = await proxyRequest(
      'GET',
      `/api/payments/status/${req.params.paymentId}`,
      null,
      { 'X-Request-ID': req.id },
      process.env.PAYMENT_URL,
    );
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

router.post('/webhook', async (req, res, next) => {
  try {
    const result = await proxyRequest(
      'POST',
      '/api/payments/webhook',
      req.body,
      { 'X-Request-ID': req.id },
      process.env.PAYMENT_URL,
    );
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
