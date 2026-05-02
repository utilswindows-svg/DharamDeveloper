const express = require('express');
const { proxyRequest } = require('../middleware/proxy');

const router = express.Router();

// Health check
router.get('/', async (req, res, next) => {
  try {
    const result = await proxyRequest('GET', '/health', null, {
      'X-Request-ID': req.id,
    });
    res.status(200).json({
      status: 'ok',
      gateway: true,
      backend: result.data?.status === 'ok',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'degraded',
      gateway: true,
      backend: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

module.exports = router;
