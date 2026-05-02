const router = require('express').Router();
router.use('/payments', require('./payment.routes'));
module.exports = router;
