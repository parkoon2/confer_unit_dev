const express = require('express');
const http = require('http');
const https = require('https');
const path = require('path');
const app = express();
const config = require('./js/config/default');
var multiparty = require('multiparty');
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
app.use(express.static('public'));

// apply the routes to our application
//app.use('/', router)
app.use('/', index);
app.use('/sharing', sharing);
app.use('/manage', manage);
app.use('/webrtc', webrtc);


app.post('/upload', function (req, res, next) {
    var form = new multiparty.Form({
        autoFiles: false,
        uploadDir: __dirname + '\\tmp\\',
        maxFilesSize: 1024 * 1024 * 200  // 파일 용량 제한
    });

    // file upload exeption
    form.on('error', function (err) {
        console.log('[upload_test.js]' + err);
        throw err;
    });

    // get uploader field key&value
    form.on('field', function (name, value) {
        console.log('[upload_test.js] form name: ' + name + ', value: ' + value);
    });

    form.on('progress', function (byteRead, byteExpected) {
        console.log('[upload_test.js] Reading total  ' + byteRead + '/' + byteExpected);
    });

    form.parse(req, function (err, fields, files) {
        console.log('################## fields', fields)
        console.log('################## files',files)
        res.status(200).send()
    })

});

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

