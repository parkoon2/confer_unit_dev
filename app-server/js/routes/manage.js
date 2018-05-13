const express = require('express');
const router = express.Router();

// controllers
const manage_controller = require('../controllers/manageController');

router.get('/friend', manage_controller.friend);

module.exports = router;