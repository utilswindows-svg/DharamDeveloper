// Auth controller — supports email + SMS OTP for password reset
const bcrypt = require('bcrypt');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const { issueTokens, rotateRefresh, revokeAll } = require('../services/tokenService');
const { createAndSendOtp, verifyOtp, isVerifiedForReset, clearVerified } = require('../services/otpService');
const axios = require('axios');

const SALT_ROUNDS = 12;

exports.signup = async (req, res, next) => {
  try {
    const { name, email, phone, password, role } = req.body;
    const exists = await User.findOne({ where: { email } });
    if (exists) throw new ApiError(409, 'Email already registered');
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({
      name, email, phone: phone || null, password: hashed,
      role: role === 'admin' ? 'admin' : 'user',
      provider: 'local',
    });
    const tokens = await issueTokens(user);
    res.status(201).json({
      success: true, message: 'Account created',
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, avatar: user.avatar },
      ...tokens,
    });
  } catch (e) { next(e); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) throw new ApiError(401, 'Invalid credentials');
    if (!user.password) throw new ApiError(401, `Use ${user.provider} sign-in for this account`);
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new ApiError(401, 'Invalid credentials');
    const tokens = await issueTokens(user);
    res.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, avatar: user.avatar },
      ...tokens,
    });
  } catch (e) { next(e); }
};

exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new ApiError(400, 'refreshToken required');
    const tokens = await rotateRefresh(refreshToken);
    res.json({ success: true, ...tokens });
  } catch (e) { next(new ApiError(401, e.message || 'Invalid refresh token')); }
};

/**
 * POST /auth/forgot-password
 * Body: { email } OR { phone }  + optional { channel: 'email'|'sms' }
 *
 * Always returns 200 to prevent user enumeration.
 */
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email, phone } = req.body;
    let channel = req.body.channel;

    // Auto-pick channel if not specified
    if (!channel) channel = phone ? 'sms' : 'email';
    if (!['email', 'sms'].includes(channel)) throw new ApiError(400, 'channel must be "email" or "sms"');

    const identifier = channel === 'email' ? email : phone;
    if (!identifier) throw new ApiError(400, `${channel === 'email' ? 'email' : 'phone'} is required`);

    // Look up the user by the chosen channel
    const where = channel === 'email' ? { email } : { phone };
    const user = await User.findOne({ where });

    if (user) {
      try {
        await createAndSendOtp(channel, identifier);
      } catch (err) {
        // Cooldown errors should still surface as 429 to give UX feedback
        if (err.statusCode === 429) throw new ApiError(429, err.message);
        throw err;
      }
    }
    res.json({
      success: true,
      message: `If an account exists, a verification code has been sent via ${channel}.`,
      channel,
    });
  } catch (e) { next(e); }
};

/**
 * POST /auth/verify-otp
 * Body: { email|phone, otp, channel? }
 */
exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, phone, otp } = req.body;
    let channel = req.body.channel || (phone ? 'sms' : 'email');
    const identifier = channel === 'email' ? email : phone;
    if (!identifier) throw new ApiError(400, 'identifier required');
    const ok = await verifyOtp(channel, identifier, otp);
    if (!ok) throw new ApiError(400, 'Invalid or expired OTP');
    res.json({ success: true, message: 'OTP verified. You may now reset your password.', channel });
  } catch (e) { next(e); }
};

/**
 * POST /auth/reset-password
 * Body: { email|phone, newPassword, channel? }
 */
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, phone, newPassword } = req.body;
    let channel = req.body.channel || (phone ? 'sms' : 'email');
    const identifier = channel === 'email' ? email : phone;
    if (!identifier) throw new ApiError(400, 'identifier required');

    const verified = await isVerifiedForReset(channel, identifier);
    if (!verified) throw new ApiError(403, 'OTP not verified or expired');

    const where = channel === 'email' ? { email } : { phone };
    const user = await User.findOne({ where });
    if (!user) throw new ApiError(404, 'User not found');

    user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await user.save();
    await clearVerified(channel, identifier);
    await revokeAll(user.id); // invalidate existing sessions on password change
    res.json({ success: true, message: 'Password updated. Please log in again.' });
  } catch (e) { next(e); }
};

/**
 * POST /auth/social
 * Body: { provider: 'google'|'facebook', accessToken }
 * Verifies token with provider, creates/links user, returns app tokens.
 */
exports.socialLogin = async (req, res, next) => {
  try {
    const { provider, accessToken } = req.body;
    if (!['google', 'facebook'].includes(provider)) throw new ApiError(400, 'Invalid provider');
    if (!accessToken) throw new ApiError(400, 'accessToken required');

    let profile = null;
    if (provider === 'google') {
      const { data } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      profile = { id: data.sub, email: data.email, name: data.name || data.email, avatar: data.picture };
    } else {
      const { data } = await axios.get('https://graph.facebook.com/me', {
        params: { fields: 'id,name,email,picture.type(large)', access_token: accessToken },
      });
      profile = { id: data.id, email: data.email, name: data.name, avatar: data.picture?.data?.url };
    }

    if (!profile.email) throw new ApiError(400, 'Provider did not return an email');

    let user = await User.findOne({ where: { email: profile.email } });
    if (!user) {
      user = await User.create({
        name: profile.name,
        email: profile.email,
        provider,
        providerId: profile.id,
        avatar: profile.avatar || null,
        role: 'user',
      });
    } else if (user.provider !== provider) {
      user.provider = provider;
      user.providerId = profile.id;
      if (profile.avatar && !user.avatar) user.avatar = profile.avatar;
      await user.save();
    }

    const tokens = await issueTokens(user);
    res.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, avatar: user.avatar },
      ...tokens,
    });
  } catch (e) {
    if (e.response) return next(new ApiError(401, `Social auth failed: ${e.response.data?.error?.message || 'invalid token'}`));
    next(e);
  }
};
