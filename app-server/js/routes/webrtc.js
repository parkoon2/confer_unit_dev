const express = require('express');
const router = express.Router();

// controllers
const webrtc_controller = require('../controllers/webRtcController')

router.get('/localconference', webrtc_controller.localconference);

module.exports = router;