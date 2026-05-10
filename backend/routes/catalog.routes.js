const router = require('express').Router();
const { listCategories, listProducts, getProduct } = require('../controllers/catalogController');

// Public catalog endpoints (no auth required)
router.get('/categories', listCategories);
router.get('/products', listProducts);
router.get('/products/:slug', getProduct);

module.exports = router;