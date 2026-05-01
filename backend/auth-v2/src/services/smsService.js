let twilioClient;
function getClient() {
  if (twilioClient) return twilioClient;
  const twilio = require("twilio");
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  return twilioClient;
}

async function sendOtpSms(to, code, purpose = "verification") {
  return getClient().messages.create({
    from: process.env.TWILIO_FROM_NUMBER,
    to,
    body: `Your ${purpose} code is ${code}. It expires in 10 minutes.`,
  });
}

module.exports = { sendOtpSms };