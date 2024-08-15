const express = require('express');
const UserController = require('./controllers/UserController');
const PostController = require('./controllers/PostController');
const CommentController = require('./controllers/CommentController');
const LikeController = require('./controllers/LikeController');
const auth = require('./middlewares/auth');
const uploads = require('./middlewares/uploads');


const router = express.Router();

router.post('/', (req, res) => {
    return res.json({
        'project': 'Dialog API',
        'author': 'Mateus Oliveira',
        'date': '14/08/2024',
    });
});


// User routes
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/user/:id', auth, UserController.getUser);


// Post routes
router.post('/posts', auth, uploads.upload.single('image'), uploads.resizeImage, PostController.createPost);
router.get('/posts', auth, PostController.getPosts);


// Comment routes
router.post('/comments', auth, CommentController.createComment);
router.get('/posts/:postId/comments', CommentController.getCommentsByPost);


// Like routes
router.post('/likes', auth, LikeController.toggleLike);
router.get('/posts/:postId/likes', LikeController.getLikesByPost);


module.exports = router;
