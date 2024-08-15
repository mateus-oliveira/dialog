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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const cacheKey = `${redisConsts.POSTS_CACHE_KEY}_${page}`;

    const cachedPosts = await redisClient.get(cacheKey);
    
    if (cachedPosts) {
      return res.status(status.HTTP_200_OK).json(JSON.parse(cachedPosts));
    }

    const { count, rows: posts } = await Post.findAndCountAll({
      include: [{ model: User, attributes: ['id', 'name', 'email'] }],
      limit, offset
    });

    const response = {
      totalPosts: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      posts
    };

    await redisClient.set(cacheKey, JSON.stringify(response), {EX: redisConsts.EXPIRATION});

    res.status(status.HTTP_200_OK).json(response);
  } catch (err) {
    res.status(status.HTTP_400_BAD_REQUEST).json({ error: err.message });
  }
};