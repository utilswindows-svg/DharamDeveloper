const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Download = sequelize.define('Download', {
  id:           { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId:       { type: DataTypes.INTEGER, allowNull: false },
  orderId:      { type: DataTypes.INTEGER, allowNull: true },
  productSlug:  { type: DataTypes.STRING(100), allowNull: false },
  productTitle: { type: DataTypes.STRING(200), allowNull: false },
  version:      { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'v1.0.0' },
  fileName:     { type: DataTypes.STRING(255), allowNull: false },
  fileSize:     { type: DataTypes.STRING(50), allowNull: true },
  device:       { type: DataTypes.STRING(200), allowNull: true },
  ipAddress:    { type: DataTypes.STRING(64), allowNull: true },
}, { tableName: 'downloads', timestamps: true });

module.exports = Download;