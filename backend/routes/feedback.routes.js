const router = require('express').Router();
const auth = require('../middleware/auth');
const { createFeedback, listFeedback, updateFeedback, deleteFeedback } = require('../controllers/feedbackController');

router.post('/', createFeedback);                  // public submit
router.get('/', auth, auth.requireRole('admin'), listFeedback);
router.patch('/:id', auth, auth.requireRole('admin'), updateFeedback);
router.delete('/:id', auth, auth.requireRole('admin'), deleteFeedback);

module.exports = router;