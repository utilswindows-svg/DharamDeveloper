const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Order = sequelize.define('Order', {
  id:           { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId:       { type: DataTypes.INTEGER, allowNull: true },
  productSlug:  { type: DataTypes.STRING(100), allowNull: false },
  productTitle: { type: DataTypes.STRING(200), allowNull: false },
  licenseName:  { type: DataTypes.STRING(100), allowNull: false },
  licenseIndex: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  // Billing
  firstName:    { type: DataTypes.STRING(100), allowNull: false },
  lastName:     { type: DataTypes.STRING(100), allowNull: false },
  email:        { type: DataTypes.STRING(255), allowNull: false, validate: { isEmail: true } },
  company:      { type: DataTypes.STRING(200), allowNull: true },
  country:      { type: DataTypes.STRING(100), allowNull: false },
  zip:          { type: DataTypes.STRING(20), allowNull: false },
  // Pricing
  subtotal:     { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  tax:          { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  total:        { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  currency:     { type: DataTypes.STRING(10), allowNull: false, defaultValue: 'USD' },
  // Payment
  paymentMethod:  { type: DataTypes.ENUM('paypal', 'card', 'manual'), allowNull: false, defaultValue: 'paypal' },
  paymentStatus:  { type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'), allowNull: false, defaultValue: 'pending' },
  paypalOrderId:  { type: DataTypes.STRING(100), allowNull: true },
  paypalCaptureId:{ type: DataTypes.STRING(100), allowNull: true },
  payerEmail:     { type: DataTypes.STRING(255), allowNull: true },
  licenseKey:     { type: DataTypes.STRING(100), allowNull: true },
  seats:          { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  expiresAt:      { type: DataTypes.DATE, allowNull: true },
}, { tableName: 'orders', timestamps: true });

module.exports = Order;