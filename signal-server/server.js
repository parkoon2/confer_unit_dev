const express = require('express');
const https = require('https');
const http = require('http');
const socket = require('socket.io');

const app = express();

const d = require('domify');
const port = 7777;

const server = http.createServer(app)

server.listen(port, function() {
    console.log(`::: HTTPS :::  Core Server Started - PORT : ${port}`);
});

let io = socket.listen(server);

let friends = [
    {
        name: 'parkoon',
        email: 'bubble_e@n.c',
    },
    {
        name: 'kimkoon',
        email: 'lover_e@n.c',
    }
]

io.sockets.on('connection', function(socket) {
    console.log(`${socket.id} is connected`)
    
    socket.on('parkoon', function(data) {
        let op = data.eventOp;
        if (op === 'Friends') {
            data.friends = friends;
            io.to(socket.id).emit('parkoon', data)
        } else {
            socket.broadcast.emit('parkoon', data)
        }
        console.log(data)
    }) 
});