const path = require('path');
const redisClient = require('../config/redis');
const redisConsts = require('../constants/redisConsts');
const status = require('../constants/httpStatus');
const Post = require('../models/Post');
const User = require('../models/User');


exports.createPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const imageUrl = path.join('uploads', req.file.filename);

    const post = await Post.create({ caption, imageUrl, userId: req.user.id });
    res.status(status.HTTP_201_CREATED).json(post);
  } catch (err) {
    res.status(status.HTTP_400_BAD_REQUEST).json({ error: err.message });
  }
};


exports.getPosts = async (req, res) => {
  try {
    const cacheKey = redisConsts.POSTS_CACHE_KEY;
    const cachedPosts = await redisClient.get(cacheKey);

    if (cachedPosts) {
      return res.status(status.HTTP_200_OK).json(JSON.parse(cachedPosts));
    }

    const posts = await Post.findAll({
      include: [{ model: User, attributes: ['id', 'name', 'email'] }]
    });

    await redisClient.set(cacheKey, JSON.stringify(posts), {EX: redisConsts.EXPIRATION});

    res.status(status.HTTP_200_OK).json(posts);
  } catch (err) {
    res.status(status.HTTP_400_BAD_REQUEST).json({ error: err.message });
  }
};
