require('dotenv').config();
const app = require('./app');
const { connectDB, sequelize } = require('./config/db');
const { connectRedis } = require('./config/redis');
const { verifyMailer } = require('./config/mailer');

const PORT = Number(process.env.PORT) || 5000;

(async () => {
  try {
    await connectDB();
    await sequelize.sync(); // creates/updates tables on first run
    await connectRedis();
    await verifyMailer(); // non-fatal: warns if SMTP isn't ready
    app.listen(PORT, () => console.log(`🚀 API listening on http://localhost:${PORT}`));
  } catch (err) { console.error('Startup failed:', err); process.exit(1); }
})();
