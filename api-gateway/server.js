require('dotenv').config();
const app = require('./app');

const PORT = Number(process.env.GATEWAY_PORT) || 3001;

app.listen(PORT, () => {
  console.log(`🚀 API Gateway listening on http://localhost:${PORT}`);
  console.log(`📡 Backend service: ${process.env.BACKEND_URL}`);
});
