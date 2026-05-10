const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const bcrypt = require('bcrypt');
const { send2FAEmail } = require('../services/emailService');
const { generateOtp } = require('../utils/otp');
const SALT_ROUNDS = 12;

const SETTINGS_KEYS = ['emailNotifications', 'smsNotifications', 'marketingEmails', 'securityAlerts', 'twoFactor'];

// In-memory store for 2FA toggle OTPs: { userId -> { otp, action, expiresAt, cooldownUntil } }
const TWOFA_TTL_MS = 10 * 60 * 1000; // 10 minutes
const TWOFA_COOLDOWN_MS = 60 * 1000; // 60s between requests
const twoFaStore = new Map();
const cleanup = setInterval(() => {
  const now = Date.now();
  for (const [k, v] of twoFaStore) if (v.expiresAt < now) twoFaStore.delete(k);
}, 60_000);
if (cleanup.unref) cleanup.unref();

exports.profile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'phone', 'createdAt', 'updatedAt'],
    });
    if (!user) throw new ApiError(404, 'User not found');
    res.json({ success: true, user });
  } catch (e) { next(e); }
};

exports.getSettings = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: ['id', ...SETTINGS_KEYS] });
    if (!user) throw new ApiError(404, 'User not found');
    const settings = {};
    SETTINGS_KEYS.forEach((k) => { settings[k] = user[k]; });
    res.json({ success: true, settings });
  } catch (e) { next(e); }
};

exports.updateSettings = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) throw new ApiError(404, 'User not found');
    SETTINGS_KEYS.forEach((k) => {
      if (k === 'twoFactor') return; // 2FA must go through OTP verification
      if (typeof req.body?.[k] === 'boolean') user[k] = req.body[k];
    });
    await user.save();
    const settings = {};
    SETTINGS_KEYS.forEach((k) => { settings[k] = user[k]; });
    res.json({ success: true, message: 'Settings updated', settings });
  } catch (e) { next(e); }
};

// POST /user/2fa/request-otp  body: { enable: boolean }
exports.request2FAOtp = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) throw new ApiError(404, 'User not found');
    const enable = req.body?.enable !== false; // default to enable
    if (enable && user.twoFactor) throw new ApiError(400, '2FA is already enabled');
    if (!enable && !user.twoFactor) throw new ApiError(400, '2FA is not enabled');

    const existing = twoFaStore.get(user.id);
    if (existing && existing.cooldownUntil > Date.now()) {
      const wait = Math.ceil((existing.cooldownUntil - Date.now()) / 1000);
      throw new ApiError(429, `Please wait ${wait}s before requesting another code`);
    }

    const otp = generateOtp();
    twoFaStore.set(user.id, {
      otp,
      action: enable ? 'enable' : 'disable',
      expiresAt: Date.now() + TWOFA_TTL_MS,
      cooldownUntil: Date.now() + TWOFA_COOLDOWN_MS,
    });

    try {
      await send2FAEmail({ to: user.email, otp, ttlSeconds: TWOFA_TTL_MS / 1000, action: enable ? 'enable' : 'disable' });
    } catch (err) {
      console.error('2FA email send failed:', err.message);
      console.log(`[FALLBACK] 2FA OTP for ${user.email}: ${otp}`);
    }

    res.json({ success: true, message: `Verification code sent to ${user.email}`, action: enable ? 'enable' : 'disable' });
  } catch (e) { next(e); }
};

// POST /user/2fa/verify  body: { otp: string }
exports.verify2FA = async (req, res, next) => {
  try {
    const { otp } = req.body || {};
    if (!otp) throw new ApiError(400, 'otp is required');
    const user = await User.findByPk(req.user.id);
    if (!user) throw new ApiError(404, 'User not found');

    const entry = twoFaStore.get(user.id);
    if (!entry || entry.expiresAt < Date.now()) throw new ApiError(400, 'Code expired. Please request a new one.');
    if (String(entry.otp) !== String(otp).trim()) throw new ApiError(400, 'Invalid verification code');

    user.twoFactor = entry.action === 'enable';
    await user.save();
    twoFaStore.delete(user.id);

    res.json({
      success: true,
      message: `Two-factor authentication ${user.twoFactor ? 'enabled' : 'disabled'}`,
      twoFactor: user.twoFactor,
    });
  } catch (e) { next(e); }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword) throw new ApiError(400, 'currentPassword and newPassword are required');
    if (String(newPassword).length < 8) throw new ApiError(400, 'New password must be at least 8 characters');

    const user = await User.findByPk(req.user.id);
    if (!user) throw new ApiError(404, 'User not found');
    if (!user.password) throw new ApiError(400, `Account uses ${user.provider} sign-in; cannot change password`);

    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) throw new ApiError(401, 'Current password is incorrect');

    user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await user.save();
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (e) { next(e); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) throw new ApiError(404, 'User not found');

    const { name, phone, avatar } = req.body || {};
    if (typeof name === 'string' && name.trim()) user.name = name.trim();
    if (typeof phone === 'string') user.phone = phone.trim() || null;
    if (typeof avatar === 'string') user.avatar = avatar.trim() || null;

    await user.save();
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (e) { next(e); }
};
