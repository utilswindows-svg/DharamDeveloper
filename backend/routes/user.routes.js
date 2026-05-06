const router = require('express').Router();
const auth = require('../middleware/auth');
const { profile } = require('../controllers/userController');
router.get('/profile', auth, profile);
module.exports = router;
