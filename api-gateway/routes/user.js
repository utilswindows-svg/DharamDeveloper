const express = require('express');
const { proxyRequest } = require('../middleware/proxy');

const router = express.Router();

// Get user profile
router.get('/profile', async (req, res, next) => {
  try {
    const result = await proxyRequest('GET', '/api/users/profile', null, {
      'X-Request-ID': req.id,
      Authorization: req.headers.authorization,
    });
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

// Update user profile
router.put('/profile', async (req, res, next) => {
  try {
    const result = await proxyRequest('PUT', '/api/users/profile', req.body, {
      'X-Request-ID': req.id,
      Authorization: req.headers.authorization,
    });
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

// Get all users (admin only)
router.get('/', async (req, res, next) => {
  try {
    const result = await proxyRequest('GET', '/api/users', null, {
      'X-Request-ID': req.id,
      Authorization: req.headers.authorization,
    });
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

// Get user by ID
router.get('/:id', async (req, res, next) => {
  try {
    const result = await proxyRequest('GET', `/api/users/${req.params.id}`, null, {
      'X-Request-ID': req.id,
      Authorization: req.headers.authorization,
    });
    res.status(result.status).json(result.data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
