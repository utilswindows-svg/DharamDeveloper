const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

/**
 * Feedback model — stores user-submitted feedback / reviews.
 */
const Feedback = sequelize.define(
  "Feedback",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false },
    product: { type: DataTypes.STRING(150), allowNull: true },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
      validate: { min: 1, max: 5 },
    },
    message: { type: DataTypes.TEXT, allowNull: false },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
    },
    ipAddress: { type: DataTypes.STRING(64), allowNull: true },
  },
  {
    tableName: "feedbacks",
    timestamps: true,
    indexes: [{ fields: ["email"] }, { fields: ["status"] }],
  }
);

module.exports = Feedback;