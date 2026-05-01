const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true, validate: { isEmail: true } },
    phone: { type: DataTypes.STRING(20), allowNull: true, unique: true },
    passwordHash: { type: DataTypes.STRING(255), allowNull: false },
    role: { type: DataTypes.ENUM("user", "admin"), defaultValue: "user" },
    isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    lastLoginAt: { type: DataTypes.DATE, allowNull: true },
  },
  { tableName: "users", timestamps: true }
);

module.exports = User;