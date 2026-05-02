const { v4: uuidv4 } = require('uuid');

const payments = new Map();

const createPayment = (req, res) => {
  const { amount, currency = 'USD', customerEmail, paymentMethod } = req.body;

  if (!amount || !customerEmail || !paymentMethod) {
    return res.status(400).json({ success: false, message: 'amount, customerEmail and paymentMethod are required.' });
  }

  const paymentId = uuidv4();
  const payment = {
    id: paymentId,
    amount,
    currency,
    status: 'pending',
    customerEmail,
    paymentMethod,
    createdAt: new Date().toISOString(),
  };

  payments.set(paymentId, payment);

  return res.status(201).json({
    success: true,
    message: 'Payment request created.',
    payment,
  });
};

const getPaymentStatus = (req, res) => {
  const { paymentId } = req.params;
  const payment = payments.get(paymentId);

  if (!payment) {
    return res.status(404).json({ success: false, message: 'Payment not found.' });
  }

  return res.json({ success: true, payment });
};

const handleWebhook = (req, res) => {
  const { paymentId, status } = req.body;

  if (!paymentId || !status) {
    return res.status(400).json({ success: false, message: 'paymentId and status are required.' });
  }

  const payment = payments.get(paymentId);
  if (!payment) {
    return res.status(404).json({ success: false, message: 'Payment not found.' });
  }

  payment.status = status;
  payment.updatedAt = new Date().toISOString();
  payments.set(paymentId, payment);

  return res.json({ success: true, message: 'Payment status updated.', payment });
};

module.exports = {
  createPayment,
  getPaymentStatus,
  handleWebhook,
};
