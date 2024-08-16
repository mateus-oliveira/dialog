const CommentController = require('../controllers/CommentController');
const Comment = require('../models/Comment');
const User = require('../models/User');
const redisClient = require('../config/redis');
const redisConsts = require('../constants/redisConsts');
const status = require('../constants/httpStatus');


jest.mock('redis', () => {
  return {
    createClient: jest.fn().mockReturnValue({
      on: jest.fn(),
      connect: jest.fn(),
      get: jest.fn(),
      set: jest.fn(),
    }),
  };
});


jest.mock('../models/Comment');
jest.mock('../config/redis');


describe('Comment Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      user: { id: 1 }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });


  describe('CommentController.createComment', () => {
    it('should create a comment and return it', async () => {
      const commentData = { content: 'Great post!', postId: 1 };
      req.body = commentData;
      const createdComment = { id: 1, ...commentData, userId: req.user.id };

      Comment.create.mockResolvedValue(createdComment);

      await CommentController.createComment(req, res);

      expect(Comment.create).toHaveBeenCalledWith({ ...commentData, userId: req.user.id });
      expect(res.status).toHaveBeenCalledWith(status.HTTP_201_CREATED);
      expect(res.json).toHaveBeenCalledWith(createdComment);
    });

    it('should return an error if comment creation fails', async () => {
      const errorMessage = 'Error creating comment';
      req.body = { content: 'Great post!', postId: 1 };

      Comment.create.mockRejectedValue(new Error(errorMessage));

      await CommentController.createComment(req, res);

      expect(res.status).toHaveBeenCalledWith(status.HTTP_400_BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });


  describe('CommentController.getCommentsByPost', () => {
    it('should return comments from the database and cache them if not cached', async () => {
      req.params.postId = 1;
      const comments = [{ id: 1, content: 'Nice!', postId: 1 }];
      redisClient.get.mockResolvedValue(null);
      Comment.findAll.mockResolvedValue(comments);

      await CommentController.getCommentsByPost(req, res);

      expect(Comment.findAll).toHaveBeenCalledWith({
        where: { postId: 1 },
        include: [{ model: User, attributes: ['id', 'name', 'email'] }]
      });
      expect(res.status).toHaveBeenCalledWith(status.HTTP_200_OK);
      expect(res.json).toHaveBeenCalledWith(comments);
    });

    it('should return an error if fetching comments fails', async () => {
      req.params.postId = 1;
      const errorMessage = 'Error fetching comments';

      redisClient.get.mockResolvedValue(null);
      Comment.findAll.mockRejectedValue(new Error(errorMessage));

      await CommentController.getCommentsByPost(req, res);

      expect(res.status).toHaveBeenCalledWith(status.HTTP_400_BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
});
