const express = require('express');
const https = require('https');
const http = require('http');
const socketio = require('socket.io');

const app = express();

const port = 7777;

const server = https.createServer(app)

server.listen(port, function() {
    console.log(`::: HTTPS :::  Core Server Started - PORT : ${port}`);
});


socketio(server).of('/CoreServer').on('connection', function(socket) {
    console.log(`${socket.id} is connected`)
    
    socket.on('parkoon', function(data) {
        console.log(data)
    }) 
});