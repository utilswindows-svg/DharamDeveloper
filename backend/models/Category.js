const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Category = sequelize.define('Category', {
  id:          { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  key:         { type: DataTypes.STRING(50), allowNull: false, unique: true },
  label:       { type: DataTypes.STRING(120), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  sortOrder:   { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  active:      { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
}, { tableName: 'categories', timestamps: true });

module.exports = Category;