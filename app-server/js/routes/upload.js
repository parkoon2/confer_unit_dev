const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const uploadConf = require('../../js/config/upload');

// controllers
const upload_controller = require('../controllers/uploadController')

let upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            // 폴더 없으면 폴더 만들어야함.
            cb(null, path.join(__dirname, '../../', uploadConf.dir));
        },
        filename: function (req, file, cb) {
            let extname = path.extname(file.originalname)
            if (file.originalname === 'blob') {
                extname = '.png';
            }
            cb(null, new Date().valueOf() + extname);
        }
    }),
})
// array('filed 명', 받을 파일 개수)
let type = upload.array(uploadConf.fieldname, uploadConf.maxfile);

router.post('/', type, upload_controller.fileupload);

module.exports = router;