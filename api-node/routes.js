const express = require('express');

const router = express.Router();

router.post('/', (req, res) => {
    return res.json({
        'project': 'Dialog API',
        'author': 'Mateus Oliveira',
        'date': '14/08/2024',
    });
});


module.exports = router;
