const { sequelize } = require('../config/db');
const User = require('./User');
const Order = require('./Order');
const Feedback = require('./Feedback');
module.exports = { sequelize, User, Order, Feedback };
