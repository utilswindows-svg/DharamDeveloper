const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const User = require("../models/User");
const { createOtp, verifyOtp } = require("../services/otpService");
const { sendOtpEmail } = require("../services/emailService");
const { sendOtpSms } = require("../services/smsService");
const {
  signAccessToken,
  signRefreshToken,
  rotateRefreshToken,
  revokeRefreshToken,
} = require("../services/tokenService");

const isEmail = (s) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s);

function publicUser(u) {
  return {
    id: u.id, name: u.name, email: u.email, phone: u.phone,
    role: u.role, isVerified: u.isVerified,
  };
}

exports.signup = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ success: false, message: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, phone, passwordHash });

    // Send verification OTP via email
    const { code } = await createOtp("verify", email);
    try { await sendOtpEmail(email, code, "verification"); } catch (e) { console.error("[email]", e.message); }

    res.status(201).json({
      success: true,
      message: "Account created. Verification code sent to email.",
      user: publicUser(user),
    });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ success: false, message: "Invalid credentials" });

    user.lastLoginAt = new Date();
    await user.save();

    const accessToken = signAccessToken(user);
    const refreshToken = await signRefreshToken(user);
    res.json({ success: true, user: publicUser(user), accessToken, refreshToken });
  } catch (err) { next(err); }
};

exports.requestOtp = async (req, res, next) => {
  try {
    const { identifier, channel, purpose } = req.body;

    // For "reset", silently succeed even if user doesn't exist (avoid enumeration)
    if (purpose === "reset") {
      const where = isEmail(identifier) ? { email: identifier } : { phone: identifier };
      const user = await User.findOne({ where });
      if (!user) return res.json({ success: true, message: "If the account exists, a code has been sent." });
    }

    const { code } = await createOtp(purpose, identifier);

    if (channel === "email") {
      if (!isEmail(identifier)) return res.status(400).json({ success: false, message: "Email identifier required" });
      await sendOtpEmail(identifier, code, purpose);
    } else {
      await sendOtpSms(identifier, code, purpose);
    }

    res.json({ success: true, message: `OTP sent via ${channel}` });
  } catch (err) { next(err); }
};

exports.verifyOtpHandler = async (req, res, next) => {
  try {
    const { identifier, code, purpose } = req.body;
    const result = await verifyOtp(purpose, identifier, code);
    if (!result.ok) return res.status(400).json({ success: false, message: result.reason });

    if (purpose === "verify") {
      const where = isEmail(identifier) ? { email: identifier } : { phone: identifier };
      const user = await User.findOne({ where });
      if (user) { user.isVerified = true; await user.save(); }
    }

    if (purpose === "login") {
      const where = isEmail(identifier) ? { email: identifier } : { phone: identifier };
      const user = await User.findOne({ where });
      if (!user) return res.status(404).json({ success: false, message: "User not found" });
      const accessToken = signAccessToken(user);
      const refreshToken = await signRefreshToken(user);
      return res.json({ success: true, user: publicUser(user), accessToken, refreshToken });
    }

    res.json({ success: true, message: "OTP verified" });
  } catch (err) { next(err); }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { identifier, code, newPassword } = req.body;
    const result = await verifyOtp("reset", identifier, code);
    if (!result.ok) return res.status(400).json({ success: false, message: result.reason });

    const where = isEmail(identifier) ? { email: identifier } : { phone: identifier };
    const user = await User.findOne({ where });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.passwordHash = await bcrypt.hash(newPassword, 12);
    await user.save();
    res.json({ success: true, message: "Password updated. Please log in." });
  } catch (err) { next(err); }
};

exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const payload = await rotateRefreshToken(refreshToken);
    const user = await User.findByPk(payload.sub);
    if (!user) return res.status(401).json({ success: false, message: "User not found" });

    const accessToken = signAccessToken(user);
    const newRefresh = await signRefreshToken(user);
    res.json({ success: true, accessToken, refreshToken: newRefresh });
  } catch {
    res.status(401).json({ success: false, message: "Invalid refresh token" });
  }
};

exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body || {};
    if (refreshToken) await revokeRefreshToken(refreshToken);
    res.json({ success: true, message: "Logged out" });
  } catch (err) { next(err); }
};

exports.me = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.sub);
    if (!user) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, user: publicUser(user) });
  } catch (err) { next(err); }
};