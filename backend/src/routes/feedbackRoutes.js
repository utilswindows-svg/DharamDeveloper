const express = require("express");
const rateLimit = require("express-rate-limit");

const ctrl = require("../controllers/feedbackController");
const validate = require("../middlewares/validate");
const { authenticate, requireAdmin } = require("../middlewares/auth");
const {
  createFeedbackRules,
  idParamRule,
  listQueryRules,
  updateStatusRules,
} = require("../validators/feedbackValidator");

const router = express.Router();

// Anti-spam limiter for the public submission endpoint
const submitLimiter = rateLimit({
  windowMs: parseInt(process.env.FEEDBACK_RATE_WINDOW_MS, 10) || 15 * 60 * 1000,
  max: parseInt(process.env.FEEDBACK_RATE_MAX, 10) || 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many submissions, please try again later." },
});

// ---- PUBLIC ----
router.post("/", submitLimiter, createFeedbackRules, validate, ctrl.createFeedback);

// ---- ADMIN ----
router.get("/stats", authenticate, requireAdmin, ctrl.getStats);
router.get("/", authenticate, requireAdmin, listQueryRules, validate, ctrl.listFeedback);
router.get("/:id", authenticate, requireAdmin, idParamRule, validate, ctrl.getFeedback);
router.patch("/:id/status", authenticate, requireAdmin, idParamRule, updateStatusRules, validate, ctrl.updateStatus);
router.delete("/:id", authenticate, requireAdmin, idParamRule, validate, ctrl.deleteFeedback);

module.exports = router;