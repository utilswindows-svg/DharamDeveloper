const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
  id:       { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name:     { type: DataTypes.STRING(100), allowNull: false },
  email:    { type: DataTypes.STRING(255), allowNull: false, unique: true, validate: { isEmail: true } },
  phone:    { type: DataTypes.STRING(20), allowNull: true, unique: false }, // E.164 e.g. +14155552671
  password: { type: DataTypes.STRING(255), allowNull: true },
  role:     { type: DataTypes.ENUM('user', 'admin'), allowNull: false, defaultValue: 'user' },
  provider: { type: DataTypes.ENUM('local', 'google', 'facebook'), allowNull: false, defaultValue: 'local' },
  providerId: { type: DataTypes.STRING(255), allowNull: true },
  avatar:   { type: DataTypes.STRING(500), allowNull: true },
  emailNotifications: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  smsNotifications:   { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  marketingEmails:    { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  securityAlerts:     { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  twoFactor:          { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
}, { tableName: 'users', timestamps: true });

module.exports = User;
