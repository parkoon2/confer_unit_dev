const express = require('express');
const https = require('https');
const http = require('http');
const socket = require('socket.io');

const app = express();

const port = 7777;

const server = http.createServer(app)

server.listen(port, function() {
    console.log(`::: HTTPS :::  Core Server Started - PORT : ${port}`);
});

let io = socket.listen(server);

io.sockets.on('connection', function(socket) {
    console.log(`${socket.id} is connected`)
    
    socket.on('parkoon', function(data) {
        socket.broadcast.emit('parkoon', data)
        console.log(data)
    }) 
});