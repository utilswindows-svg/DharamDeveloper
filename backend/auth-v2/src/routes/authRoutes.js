const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const ctrl = require("../controllers/authController");
const v = require("../validators/authValidator");
const validate = require("../middlewares/validate");
const { authenticate } = require("../middlewares/auth");

const otpLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
  max: parseInt(process.env.OTP_RATE_MAX || "5", 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many OTP requests, try again later." },
});

const authLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
  max: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/signup", authLimiter, v.signup, validate, ctrl.signup);
router.post("/login", authLimiter, v.login, validate, ctrl.login);
router.post("/otp/request", otpLimiter, v.requestOtp, validate, ctrl.requestOtp);
router.post("/otp/verify", otpLimiter, v.verifyOtp, validate, ctrl.verifyOtpHandler);
router.post("/password/reset", otpLimiter, v.resetPassword, validate, ctrl.resetPassword);
router.post("/refresh", v.refresh, validate, ctrl.refresh);
router.post("/logout", ctrl.logout);
router.get("/me", authenticate, ctrl.me);

module.exports = router;