const express = require('express');
const https = require('https');
const http = require('http');
const socket = require('socket.io');

const kurento = require('kurento-client');
const mediaserver = "ws://106.240.247.43:7777/kurento"; // STAGING
const app = express();

const d = require('domify');
const port = 7777;

const server = http.createServer(app)




let kurentClient, mediaPipeline, webRtcEndpoint;
let clients = {};
let candiQue = []

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
        } else if (op ==='Call') {
            io.to(socket.id).emit('parkoon', data)
            data.eventOp = 'Invite';
            socket.broadcast.emit('parkoon', data)
        } else if (op ==='Join') {
            io.to(socket.id).emit('parkoon', data)
        } else if (op ==='Inivte') {
        } else if (op ==='SDP') {
            socket.broadcast.emit('parkoon', data)
        } else if (op ==='Candidate') {
            socket.broadcast.emit('parkoon', data)
        } else if (op ==='ExitRoom') {
            socket.broadcast.emit('parkoon', data)
        }
        else {
            //socket.broadcast.emit('parkoon', data)
        }
        console.log(data)
    });











    socket.on('multiconfer', function(data) {
        let id = data.id;
       
        switch (id) {
            case 'client':
                let sdpOffer = data.offerSdp;
                getKurentoClient(mediaserver, function(err, client) {
                    if (err) { throw err; }
                    kurentClient = client;
                    getMediaPipeline(kurentClient, function(err, pipe) {
                        if (err) { throw err; }
                        mediaPipeline = pipe;
                        createWebRtcEndPoint(mediaPipeline, function(err, endpoint) {
                            console.log('createWebRtcEndPoint')
                            webRtcEndpoint = endpoint;
                            
                            webRtcEndpoint.on('OnIceCandidate', function(event) {
                                console.log("## candidate ##");
                                // var candidate = kurento.register.complexTypes.IceCandidate(event.candidate);
                                // ws.send(JSON.stringify({
                                //     id : 'iceCandidate',
                                //     candidate : candidatecandidate
                                // }));
                            });

                            candiQue.forEach(function(candi) {
                                webRtcEndpoint.addIceCandidate(candi);
                            })

                            console.log('sdpOffer', sdpOffer)
                            webRtcEndpoint.processOffer(sdpOffer, function(err, sdpAnswer) {
                                
                                if (err) {
                                    console.log(err)
                                }
                                console.log('!', sdpAnswer)

                                io.to(socket.id).emit('multiconfer', {
                                    sdpAnswer: sdpAnswer
                                })
                            });

                        })
                    })
                })
            break;

            case 'candidate':
                onIceCandidate(data.candidate);
            break;
        }
    });
});




function getKurentoClient(url, callback) {
    kurento(url, function(err, _kurentoClient ) {
        if (err) {
            callback(err, null);
        }
        callback(null, _kurentoClient)
    
    });
}

function getMediaPipeline(client, callback) {
    client.create('MediaPipeline', function(err, pipe) {
        if (err) { callback(err, null); }
        callback(null, pipe);
    });
}

function createWebRtcEndPoint(pipe, callback) {
    pipe.create('WebRtcEndpoint', function(err, endpoint) {
        if (err) { callback(err, null); }
        callback(null, endpoint);
    })
}



function onIceCandidate(_candidate) {
    var candidate = kurento.register.complexTypes.IceCandidate(_candidate);
    console.log('onIceCandidate')
    candiQue.push(candidate)
    
    // if (clients[sessionId]) {
    //     //console.info('Sending candidate');
    //     var webRtcEndpoint = clients[sessionId].webRtcEndpoint;
    // }
    // else {
    //     //console.info('Queueing candidate');
    //     if (!candidatesQueue[sessionId]) {
    //         candidatesQueue[sessionId] = [];
    //     }
    //     candidatesQueue[sessionId].push(candidate);
    // }
}