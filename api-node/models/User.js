const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const dbTables = require('../constants/dbTables');


const User = sequelize.define(dbTables.USERS, {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});


module.exports = User;

