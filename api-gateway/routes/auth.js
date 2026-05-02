const express = require('express');
const { proxyRequest } = require('../middleware/proxy');

const router = express.Router();

// Login
router.post('/login', async (req, res, next) => {
  try {
    const result = await proxyRequest('POST', '/api/auth/login', req.body, {
      'X-Request-ID': req.id,
    });
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

// Signup
router.post('/signup', async (req, res, next) => {
  try {
    const result = await proxyRequest('POST', '/api/auth/signup', req.body, {
      'X-Request-ID': req.id,
    });
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

// Refresh Token
router.post('/refresh', async (req, res, next) => {
  try {
    const result = await proxyRequest('POST', '/api/auth/refresh', req.body, {
      'X-Request-ID': req.id,
      Authorization: req.headers.authorization,
    });
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res, next) => {
  try {
    const result = await proxyRequest('POST', '/api/auth/verify-otp', req.body, {
      'X-Request-ID': req.id,
    });
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

// Request OTP
router.post('/request-otp', async (req, res, next) => {
  try {
    const result = await proxyRequest('POST', '/api/auth/request-otp', req.body, {
      'X-Request-ID': req.id,
    });
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
