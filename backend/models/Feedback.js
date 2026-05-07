const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Feedback = sequelize.define('Feedback', {
  id:      { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId:  { type: DataTypes.INTEGER, allowNull: true },
  name:    { type: DataTypes.STRING(100), allowNull: false },
  email:   { type: DataTypes.STRING(255), allowNull: false, validate: { isEmail: true } },
  message: { type: DataTypes.TEXT, allowNull: false },
  status:  { type: DataTypes.ENUM('new', 'read', 'archived'), allowNull: false, defaultValue: 'new' },
}, { tableName: 'feedbacks', timestamps: true });

module.exports = Feedback;