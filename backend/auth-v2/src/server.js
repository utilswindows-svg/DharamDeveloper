const app = require("./app");
const sequelize = require("./config/db");
require("./models/User");

const PORT = process.env.PORT || 5001;

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("✅ MySQL connected & models synced (auth-v2)");
    app.listen(PORT, () => console.log(`🔐 Auth Backend V2 running on port ${PORT}`));
  } catch (err) {
    console.error("❌ Failed to start auth-v2 server:", err);
    process.exit(1);
  }
})();