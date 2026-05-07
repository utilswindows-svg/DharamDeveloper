const router = require('express').Router();
const auth = require('../middleware/auth');
const { createFeedback, listFeedback } = require('../controllers/feedbackController');

router.post('/', createFeedback);                  // public submit
router.get('/', auth, auth.requireRole('admin'), listFeedback);

module.exports = router;