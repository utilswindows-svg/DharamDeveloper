const router = require('express').Router();
const { listCategories, listProducts, getProduct, getProductOgImage } = require('../controllers/catalogController');

// Public catalog endpoints (no auth required)
router.get('/software/tools', listCategories);
router.get('/software', listProducts);
router.get('/software/:slug', getProduct);
router.get('/software/:slug/og.svg', getProductOgImage);

module.exports = router;