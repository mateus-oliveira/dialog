const redisClient = require('../config/redis');
const redisConsts = require('../constants/redisConsts');
const status = require('../constants/httpStatus');
const Like = require('../models/Like');
const User = require('../models/User');
const LikeController = require('../controllers/LikeController');


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


jest.mock('../config/redis');
jest.mock('../models/Like');


describe('Like Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      user: { id: 1 },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('toggleLike', () => {
    it('should create a like if it does not exist', async () => {
      req.body.postId = 1;
      const likeData = { id: 1, postId: req.body.postId, userId: req.user.id };
      
      Like.findOne.mockResolvedValue(null); // Simula que não existe like
      Like.create.mockResolvedValue(likeData); // Simula a criação do like

      await LikeController.toggleLike(req, res);

      expect(Like.findOne).toHaveBeenCalledWith({ where: { postId: req.body.postId, userId: req.user.id } });
      expect(Like.create).toHaveBeenCalledWith({ postId: req.body.postId, userId: req.user.id });
      expect(res.status).toHaveBeenCalledWith(status.HTTP_201_CREATED);
      expect(res.json).toHaveBeenCalledWith(likeData);
    });

    it('should remove a like if it already exists', async () => {
      req.body.postId = 1;
      const existingLike = { destroy: jest.fn() };

      Like.findOne.mockResolvedValue(existingLike); // Simula que existe um like

      await LikeController.toggleLike(req, res);

      expect(Like.findOne).toHaveBeenCalledWith({ where: { postId: req.body.postId, userId: req.user.id } });
      expect(existingLike.destroy).toHaveBeenCalled(); // Verifica se o like foi removido
      expect(res.status).toHaveBeenCalledWith(status.HTTP_200_OK);
      expect(res.json).toHaveBeenCalledWith({ message: 'Like removed' });
    });

    it('should return an error if toggling like fails', async () => {
      const errorMessage = 'Error toggling like';
      req.body.postId = 1;

      Like.findOne.mockRejectedValue(new Error(errorMessage)); // Simula erro ao buscar o like

      await LikeController.toggleLike(req, res);

      expect(res.status).toHaveBeenCalledWith(status.HTTP_400_BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('getLikesByPost', () => {
    it('should return cached likes if available', async () => {
      req.params.postId = '1';
      const cachedLikes = JSON.stringify([{ id: 1, userId: 1 }]);

      redisClient.get.mockResolvedValue(cachedLikes); // Simula que existem likes em cache

      await LikeController.getLikesByPost(req, res);

      expect(redisClient.get).toHaveBeenCalledWith(`${redisConsts.LIKES_CACHE_KEY}_1`);
      expect(res.status).toHaveBeenCalledWith(status.HTTP_200_OK);
      expect(res.json).toHaveBeenCalledWith(JSON.parse(cachedLikes));
    });

    it('should return likes from the database and cache them if not cached', async () => {
      req.params.postId = '1';
      const likes = [{ id: 1, userId: 1 }];
      redisClient.get.mockResolvedValue(null); // Simula que não existem likes em cache
      Like.findAll.mockResolvedValue(likes); // Simula a busca dos likes

      await LikeController.getLikesByPost(req, res);

      expect(redisClient.get).toHaveBeenCalledWith(`${redisConsts.LIKES_CACHE_KEY}_1`);
      expect(Like.findAll).toHaveBeenCalledWith({
        where: { postId: req.params.postId },
        include: [{ model: User, attributes: ['id', 'name', 'email'] }],
      });
      expect(redisClient.set).toHaveBeenCalledWith(`${redisConsts.LIKES_CACHE_KEY}_1`, JSON.stringify(likes), { EX: redisConsts.EXPIRATION });
      expect(res.status).toHaveBeenCalledWith(status.HTTP_200_OK);
      expect(res.json).toHaveBeenCalledWith(likes);
    });

    it('should return an error if fetching likes fails', async () => {
      const errorMessage = 'Error fetching likes';
      req.params.postId = '1';

      redisClient.get.mockResolvedValue(null);
      Like.findAll.mockRejectedValue(new Error(errorMessage)); // Simula erro ao buscar os likes

      await LikeController.getLikesByPost(req, res);

      expect(res.status).toHaveBeenCalledWith(status.HTTP_400_BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
});
