const app = require("./app");
const sequelize = require("./config/db");
require("./models/Feedback");

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // creates `feedbacks` table if missing
    // eslint-disable-next-line no-console
    console.log("✅ MySQL connected & models synced");
    app.listen(PORT, () => console.log(`🚀 Feedback API running on port ${PORT}`));
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
})();