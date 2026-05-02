const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
  id:       { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name:     { type: DataTypes.STRING(100), allowNull: false },
  email:    { type: DataTypes.STRING(255), allowNull: false, unique: true, validate: { isEmail: true } },
  phone:    { type: DataTypes.STRING(20), allowNull: true, unique: false }, // E.164 e.g. +14155552671
  password: { type: DataTypes.STRING(255), allowNull: false },
}, { tableName: 'users', timestamps: true });

module.exports = User;
