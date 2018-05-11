const express = require('express');
const http = require('http');
const https = require('https');
const app = express();
const config = require('./js/config/default');
const port = process.env.PORT || config.port;
const router = express.Router();

const server = http.createServer(app)

// Routes
const index = require('./js/routes/index') 

// apply the routes to our application
//app.use('/', router)
app.use('/', index)

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

