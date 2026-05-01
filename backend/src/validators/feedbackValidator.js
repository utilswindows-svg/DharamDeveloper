const { body, param, query } = require("express-validator");

exports.createFeedbackRules = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ max: 100 }).withMessage("Name must be ≤ 100 chars"),
  body("email")
    .trim()
    .isEmail().withMessage("Valid email is required")
    .isLength({ max: 255 }),
  body("product")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 150 }),
  body("rating")
    .optional()
    .isInt({ min: 1, max: 5 }).withMessage("Rating must be 1–5"),
  body("message")
    .trim()
    .notEmpty().withMessage("Message is required")
    .isLength({ min: 3, max: 1000 }).withMessage("Message 3–1000 chars"),
];

exports.idParamRule = [param("id").isInt({ min: 1 }).withMessage("Invalid id")];

exports.listQueryRules = [
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
  query("status").optional().isIn(["pending", "approved", "rejected"]),
  query("product").optional().isString().isLength({ max: 150 }),
];

exports.updateStatusRules = [
  body("status").isIn(["pending", "approved", "rejected"]).withMessage("Invalid status"),
];