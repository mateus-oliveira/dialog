const path = require('path');
const status = require('../constants/httpStatus');
const Post = require('../models/Post');


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
    const posts = await Post.findAll({ include: ['user'] });
    res.status(status.HTTP_200_OK).json(posts);
  } catch (err) {
    res.status(status.HTTP_400_BAD_REQUEST).json({ error: err.message });
  }
};
