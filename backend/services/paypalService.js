const axios = require('axios');

const PAYPAL_BASE = process.env.PAYPAL_MODE === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

let cachedToken = null;
let cachedExpiry = 0;

async function getAccessToken() {
  if (cachedToken && Date.now() < cachedExpiry - 60_000) return cachedToken;
  const id = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!id || !secret) throw new Error('PayPal credentials not configured');
  const { data } = await axios.post(
    `${PAYPAL_BASE}/v1/oauth2/token`,
    'grant_type=client_credentials',
    {
      auth: { username: id, password: secret },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }
  );
  cachedToken = data.access_token;
  cachedExpiry = Date.now() + data.expires_in * 1000;
  return cachedToken;
}

async function createOrder({ amount, currency = 'USD', reference }) {
  const token = await getAccessToken();
  const { data } = await axios.post(
    `${PAYPAL_BASE}/v2/checkout/orders`,
    {
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: String(reference || ''),
        amount: { currency_code: currency, value: Number(amount).toFixed(2) },
      }],
    },
    { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
  );
  return data;
}

async function captureOrder(paypalOrderId) {
  const token = await getAccessToken();
  const { data } = await axios.post(
    `${PAYPAL_BASE}/v2/checkout/orders/${paypalOrderId}/capture`,
    {},
    { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
  );
  return data;
}

module.exports = { getAccessToken, createOrder, captureOrder, PAYPAL_BASE };