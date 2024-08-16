const status = require('../constants/httpStatus');
const Like = require('../models/Like');
const User = require('../models/User');


exports.toggleLike = async (req, res) => {
  try {
    const { postId } = req.body;
    const existingLike = await Like.findOne({ where: { postId, userId: req.user.id } });

    if (existingLike) {
      await existingLike.destroy();
      res.status(status.HTTP_200_OK).json({ message: 'Like removed' });
    } else {
      const like = await Like.create({ postId, userId: req.user.id });
      res.status(status.HTTP_201_CREATED).json(like);
    }
  } catch (err) {
    res.status(status.HTTP_400_BAD_REQUEST).json({ error: err.message });
  }
};


exports.getLikesByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const likes = await Like.findAll({
      where: { postId },
      include: [{
        model: User,
        attributes: ['id', 'name', 'email']
      }]
    });

    res.status(status.HTTP_200_OK).json(likes);
  } catch (err) {
    res.status(status.HTTP_400_BAD_REQUEST).json({ error: err.message });
  }
};
