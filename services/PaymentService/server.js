require('dotenv').config();
const app = require('./app');

const PORT = Number(process.env.PORT) || 5001;

app.listen(PORT, () => {
  console.log(`🚀 PaymentService running on http://localhost:${PORT}`);
});
