const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const dbTables = require('../constants/dbTables');
const User = require('./User');


const Post = sequelize.define(dbTables.POSTS, {
  caption: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});


Post.belongsTo(User);
User.hasMany(Post);

module.exports = Post;
