const express = require('express');
const http = require('http');
const https = require('https');
const path = require('path');
const app = express();
const config = require('./js/config/default');
var multiparty = require('multiparty');
const multer = require('multer');
const port = process.env.PORT || config.port;
const router = express.Router();

const server = http.createServer(app)

const socket = require('socket.io')

// Routes
const index = require('./js/routes/index');
const sharing = require('./js/routes/sharing');
const manage = require('./js/routes/manage');
const webrtc = require('./js/routes/webrtc');

// Set EJS
app.set('views', path.join(__dirname, '/public/views'));
app.set('view engine', 'ejs');

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded());
app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// apply the routes to our application
//app.use('/', router)
app.use('/', index);
app.use('/sharing', sharing);
app.use('/manage', manage);
app.use('/webrtc', webrtc);



var upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            // 폴더 없으면 폴더 만들어야함.
            cb(null, path.join(__dirname, 'uploads/'));
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
var type = upload.array('parkoon', 10);

app.post('/upload', type, function (req, res, next) {
    console.log('!')
    //let files = JSON.stringify(req.files);
    let files = req.files;
    let result = [];
    console.log('files', files)
    files.forEach(function(file) {
        let mimetype = file.mimetype;
        let filename = file.filename;
        // 근데 경로가 너무 쉬운거 아닌가...?
        // 스트링으로 접근하기 힘든... 폴더를 하나 만들어야하나..?
        let path = `http://localhost:8000/uploads/${filename}`;
        result.push({
            mimetype,
            filename,
            path
        });
    })
    //console.log(req.body); //form fields
    //console.log(req.files); //form files
   res.status(200).send(result);
});

function pdfToImg(path) {
    console.log(path)
}

// router.use('/', function(req, res, next) {
//     console.log(req.method, req.url)

//     next()
// });

// router.param('name', function(req, res, next, name) {
//     // do validation on name here
//     // ... do some validation
//     if (name && name.length < 5) {
//         // once validation is done save the new item in the req
//         req.name = name;
//         next();
//     } else {
//         return res.send('name is so lnog')
//     }
    
// });

// router.get('/user/:name', function(req, res) {
//     // res.send(`hello ${req.params.name}!`)
//     res.send(`hello ${req.name}!`);
// });

// router.get('/b', function(req, res) {
//     res.send('B')
// });


// // put one middleware at then end of all routes which will get executed when none of the routes above match
// router.use('*', function(req, res){
//     res.status(404).send('404');
// });



server.listen(port, function(err) {
    if (err) return err;
    console.log('PORT ::: ', port);
});




// app.route('/login')

//     // show the form (GET http://localhost:8080/login)
//     .get(function(req, res) {
//         res.send('this is the login form');
//     })

//     // process the form (POST http://localhost:8080/login)
//     .post(function(req, res) {
//         console.log('processing');
//         res.send('processing the login form!');
//     });

