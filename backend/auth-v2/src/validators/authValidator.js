const { body } = require("express-validator");

exports.signup = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 100 }),
  body("email").trim().isEmail().withMessage("Valid email required").normalizeEmail(),
  body("phone").optional({ checkFalsy: true }).trim().matches(/^\+?[1-9]\d{7,14}$/).withMessage("Valid E.164 phone required"),
  body("password").isLength({ min: 8 }).withMessage("Password must be ≥ 8 chars"),
];

exports.login = [
  body("email").trim().isEmail().normalizeEmail(),
  body("password").notEmpty(),
];

exports.requestOtp = [
  body("identifier").trim().notEmpty().withMessage("Email or phone required"),
  body("channel").isIn(["email", "sms"]).withMessage("channel must be email or sms"),
  body("purpose").isIn(["verify", "reset", "login"]).withMessage("Invalid purpose"),
];

exports.verifyOtp = [
  body("identifier").trim().notEmpty(),
  body("purpose").isIn(["verify", "reset", "login"]),
  body("code").isLength({ min: 4, max: 8 }),
];

exports.resetPassword = [
  body("identifier").trim().notEmpty(),
  body("code").isLength({ min: 4, max: 8 }),
  body("newPassword").isLength({ min: 8 }),
];

exports.refresh = [body("refreshToken").notEmpty()];