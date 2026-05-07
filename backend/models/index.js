const { sequelize } = require('../config/db');
const User = require('./User');
const Order = require('./Order');
module.exports = { sequelize, User, Order };
