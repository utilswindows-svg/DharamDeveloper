const { sequelize } = require('../config/db');
const User = require('./User');
const Order = require('./Order');
const Feedback = require('./Feedback');
const Download = require('./Download');
const Category = require('./Category');
const Product = require('./Product');

// Associations
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

User.hasMany(Download, { foreignKey: 'userId', as: 'downloads' });
Download.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = { sequelize, User, Order, Feedback, Download, Category, Product };
