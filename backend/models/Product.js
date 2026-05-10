const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Product = sequelize.define('Product', {
  id:           { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  slug:         { type: DataTypes.STRING(100), allowNull: false, unique: true },
  title:        { type: DataTypes.STRING(200), allowNull: false },
  tagline:      { type: DataTypes.STRING(500), allowNull: true },
  description:  { type: DataTypes.TEXT, allowNull: true },
  icon:         { type: DataTypes.STRING(50), allowNull: true }, // lucide icon name
  color:        { type: DataTypes.STRING(50), allowNull: true }, // tailwind text-* class
  startingPrice:{ type: DataTypes.DECIMAL(10, 2), allowNull: true },
  categoryId:   { type: DataTypes.INTEGER, allowNull: true },
  featured:     { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  active:       { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  sortOrder:    { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
}, { tableName: 'products', timestamps: true });

module.exports = Product;