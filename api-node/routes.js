const express = require('express');
const UserController = require('./controllers/UserController');

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
router.get('/user/:id', UserController.getUser);



module.exports = router;
