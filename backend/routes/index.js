const router = require('express').Router();
router.use('/auth', require('./auth.routes'));
router.use('/user', require('./user.routes'));
router.use('/feedback', require('./feedback.routes'));
router.use('/catalog', require('./catalog.routes'));
module.exports = router;
