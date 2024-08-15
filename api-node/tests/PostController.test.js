const path = require('path');
const redisClient = require('../config/redis');
const redisConsts = require('../constants/redisConsts');
const status = require('../constants/httpStatus');
const Post = require('../models/Post');
const User = require('../models/User');
const PostController = require('../controllers/PostController');


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

jest.mock('path');
jest.mock('../config/redis');
jest.mock('../models/Post');


describe('Post Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      query: {},
      file: {},
      user: { id: 1 },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('createPost', () => {
    it('should create a new post and return it', async () => {
      req.body.caption = 'This is a caption';
      req.file.filename = 'image.png';
      const postData = { caption: req.body.caption, imageUrl: path.join('uploads', req.file.filename), userId: req.user.id };
      const createdPost = { id: 1, ...postData };

      path.join.mockReturnValue(postData.imageUrl);
      Post.create.mockResolvedValue(createdPost);

      await PostController.createPost(req, res);

      expect(path.join).toHaveBeenCalledWith('uploads', req.file.filename);
      expect(Post.create).toHaveBeenCalledWith(postData);
      expect(res.status).toHaveBeenCalledWith(status.HTTP_201_CREATED);
      expect(res.json).toHaveBeenCalledWith(createdPost);
    });

    it('should return an error if post creation fails', async () => {
      const errorMessage = 'Error creating post';
      req.body.caption = 'This is a caption';
      req.file.filename = 'image.png';

      Post.create.mockRejectedValue(new Error(errorMessage));

      await PostController.createPost(req, res);

      expect(res.status).toHaveBeenCalledWith(status.HTTP_400_BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('getPosts', () => {
    it('should return cached posts if available', async () => {
      req.query.page = '1';
      req.query.limit = '10';
      const cachedPosts = JSON.stringify({
        totalPosts: 2,
        totalPages: 1,
        currentPage: 1,
        posts: [],
      });
      redisClient.get.mockResolvedValue(cachedPosts);

      await PostController.getPosts(req, res);

      expect(redisClient.get).toHaveBeenCalledWith(`${redisConsts.POSTS_CACHE_KEY}_1`);
      expect(res.status).toHaveBeenCalledWith(status.HTTP_200_OK);
      expect(res.json).toHaveBeenCalledWith(JSON.parse(cachedPosts));
    });

    it('should return posts from the database and cache them if not cached', async () => {
      req.query.page = '1';
      req.query.limit = '10';
      const posts = [{ id: 1, caption: 'Post 1' }];
      const count = posts.length;

      redisClient.get.mockResolvedValue(null);
      Post.findAndCountAll.mockResolvedValue({ count, rows: posts });
      const response = {
        totalPosts: count,
        totalPages: 1,
        currentPage: 1,
        posts,
      };
      redisClient.set.mockResolvedValue();

      await PostController.getPosts(req, res);

      expect(redisClient.get).toHaveBeenCalledWith(`${redisConsts.POSTS_CACHE_KEY}_1`);
      expect(Post.findAndCountAll).toHaveBeenCalledWith({
        include: [{ model: User, attributes: ['id', 'name', 'email'] }],
        limit: 10,
        offset: 0,
      });
      expect(redisClient.set).toHaveBeenCalledWith(`${redisConsts.POSTS_CACHE_KEY}_1`, JSON.stringify(response), { EX: redisConsts.EXPIRATION });
      expect(res.status).toHaveBeenCalledWith(status.HTTP_200_OK);
      expect(res.json).toHaveBeenCalledWith(response);
    });

    it('should return an error if fetching posts fails', async () => {
      const errorMessage = 'Error fetching posts';
      req.query.page = '1';
      req.query.limit = '10';

      redisClient.get.mockResolvedValue(null);
      Post.findAndCountAll.mockRejectedValue(new Error(errorMessage));

      await PostController.getPosts(req, res);

      expect(res.status).toHaveBeenCalledWith(status.HTTP_400_BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
});
