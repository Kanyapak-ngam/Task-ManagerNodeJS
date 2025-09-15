const sequelize = require('../config/database');
const User = require('./user');
const Task = require('./task');

// ความสัมพันธ์ 1 User มีหลาย Task
User.hasMany(Task, { foreignKey: 'userId', as: 'tasks' });
Task.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = { sequelize, User, Task };
