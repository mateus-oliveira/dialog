const sequelize = require('../config/db');
const dbTables = require('../constants/dbTables');
const User = require('./User');
const Post = require('./Post');


const Like = sequelize.define(dbTables.LIKES, {});


Like.belongsTo(User);
Like.belongsTo(Post);
User.hasMany(Like);
Post.hasMany(Like);


module.exports = Like;
