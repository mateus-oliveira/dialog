const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const dbTables = require('../constants/dbTables');
const User = require('./User');
const Post = require('./Post');


const Comment = sequelize.define(dbTables.COMMENTS, {
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});


Comment.belongsTo(User);
Comment.belongsTo(Post);
User.hasMany(Comment);
Post.hasMany(Comment);


module.exports = Comment;
