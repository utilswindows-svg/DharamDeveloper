const crypto = require('crypto');
const generateOtp = (length = Number(process.env.OTP_LENGTH) || 6) => {
  const max = 10 ** length;
  return crypto.randomInt(0, max).toString().padStart(length, '0');
};
module.exports = { generateOtp };
