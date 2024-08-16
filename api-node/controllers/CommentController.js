const status = require('../constants/httpStatus');
const Comment = require('../models/Comment');
const User = require('../models/User');


exports.createComment = async (req, res) => {
  try {
    const { content, postId } = req.body;
    const comment = await Comment.create({ content, postId, userId: req.user.id });
    res.status(status.HTTP_201_CREATED).json(comment);
  } catch (err) {
    res.status(status.HTTP_400_BAD_REQUEST).json({ error: err.message });
  }
};


exports.getCommentsByPost = async (req, res) => {
    try {
      const { postId } = req.params;
  
      const comments = await Comment.findAll({
        where: { postId },
        include: [{
          model: User,
          attributes: ['id', 'name', 'email']
        }]
      });
  
      res.status(status.HTTP_200_OK).json(comments);
    } catch (err) {
      res.status(status.HTTP_400_BAD_REQUEST).json({ error: err.message });
    }
  };
