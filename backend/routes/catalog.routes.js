const router = require('express').Router();
const { listCategories, listProducts, getProduct, getProductOgImage } = require('../controllers/catalogController');

// Public catalog endpoints (no auth required)
router.get('/categories', listCategories);
router.get('/products', listProducts);
router.get('/products/:slug', getProduct);
router.get('/products/:slug/og.svg', getProductOgImage);

module.exports = router;