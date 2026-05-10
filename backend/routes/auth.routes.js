const router = require('express').Router();
const { body, oneOf } = require('express-validator');
const validate = require('../middleware/validate');
const { authLimiter, otpLimiter } = require('../middleware/rateLimit');
const c = require('../controllers/authController');
const auth = require('../middleware/auth');

// E.164 phone regex (e.g., +14155552671)
const phoneRule = body('phone').optional().matches(/^\+[1-9]\d{6,14}$/).withMessage('phone must be E.164 (+1234567890)');

router.post('/signup', authLimiter,
  [
    body('name').isString().trim().isLength({ min: 2, max: 100 }),
    body('email').isEmail().normalizeEmail(),
    phoneRule,
    body('password').isString().isLength({ min: 8, max: 128 }),
  ], validate, c.signup);

router.post('/login', authLimiter,
  [body('email').isEmail().normalizeEmail(), body('password').isString().notEmpty()],
  validate, c.login);

router.post('/refresh', authLimiter,
  [body('refreshToken').isString().notEmpty()], validate, c.refresh);

// Forgot password — accepts EITHER email OR phone, with optional channel override
router.post('/forgot-password', otpLimiter,
  [
    oneOf([body('email').isEmail(), body('phone').matches(/^\+[1-9]\d{6,14}$/)],
      { message: 'Provide a valid email or E.164 phone' }),
    body('channel').optional().isIn(['email', 'sms']),
  ], validate, c.forgotPassword);

router.post('/verify-otp', otpLimiter,
  [
    oneOf([body('email').isEmail(), body('phone').matches(/^\+[1-9]\d{6,14}$/)],
      { message: 'Provide a valid email or E.164 phone' }),
    body('otp').isString().isLength({ min: 4, max: 10 }),
    body('channel').optional().isIn(['email', 'sms']),
  ], validate, c.verifyOtp);

router.post('/reset-password', authLimiter,
  [
    oneOf([body('email').isEmail(), body('phone').matches(/^\+[1-9]\d{6,14}$/)],
      { message: 'Provide a valid email or E.164 phone' }),
    body('newPassword').isString().isLength({ min: 8, max: 128 }),
    body('channel').optional().isIn(['email', 'sms']),
  ], validate, c.resetPassword);

router.post('/social', authLimiter,
  [
    body('provider').isIn(['google', 'facebook']),
    body('accessToken').isString().notEmpty(),
  ], validate, c.socialLogin);

// Logout — revokes all refresh tokens for the authenticated user
router.post('/logout', auth, c.logout);

module.exports = router;
