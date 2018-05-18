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
    });


    socket.on('multiconfer', function(data) {
        let eventOp = data.eventOp;
       
        switch (eventOp) {
            case 'sdp':
                let sdpOffer = data.offerSdp;
                getKurentoClient(mediaserver, function(err, client) {
                    if (err) { throw err; }
                    kurentClient = client;
                    getMediaPipeline(kurentClient, function(err, pipe) {
                        if (err) { throw err; }
                        console.log('############## Create Pipeline')
                        
                        mediaPipeline = pipe;
                        createWebRtcEndPoint(mediaPipeline, function(err, endpoint) {
                            console.log('############## Create Endpoint')
                            webRtcEndpoint = endpoint;
                            
                            // webRtcEndpoint.on('OnIceCandidate', function(event) {
                            //     console.log("## candidate ##");
                            //     io.to(socket.id).emit('multiconfer', {
                            //         eventOp: 'candidate',
                            //         candidate: event.candidate,
                            //     })
                            // });

                            // candiQue.forEach(function(candi) {
                            //     webRtcEndpoint.addIceCandidate(candi);
                            // })

                            webRtcEndpoint.processOffer(sdpOffer, function(err, sdpAnswer) {
                                
                                if (err) {
                                    console.log(err)
                                }
                                io.to(socket.id).emit('multiconfer', {
                                    eventOp: 'answer',
                                    sdpAnswer: sdpAnswer,
                                })
                            });


                            webRtcEndpoint.gatherCandidates(function(err) {
                                if (err) console.log(err);

                            });


                            var filter;
                            console.log('필터시작')

                            createFilter(mediaPipeline,'capsfilter caps=video/x-raw,wgcp_participant=' + 4, 'VIDEO', function(videoObj) {
                                filter = videoObj;
                                getComposite(mediaPipeline, function(composite) {

                                    composite.on('_rpc', function(err, event) {

                                    }, function(err) {
                                        console.log(err)
                                    })
                                    
                                    createHubPort(composite, function(hurb) {
                                        console.log('!!!!!!!!!!!!!', hurb)
                                        webRtcEndpoint.connect(hurb, function(err, event) {
                                            if (err) console.log(err)
                                            hurb.getSinkConnections(function(err, event, result) {
                                                if (err) console.log(err)
                                            
                                                //console.log(event)
                                            })
                                        })

                                        hurb.connect(webRtcEndpoint, function(){
                                            console.log('!!!!!!!!!!!!!!!!!!!!!connect')
                                            // console.log("clients[id].hubPort.setMaxOutputBitrate(2000) : ",clients[id].hubPort.getMaxOutputBitrate(function(err, event){
                                            //     console.log("$$$$$$ value $$$$$$ : ",err, event);
                                            // }));
                                        });
                                    })

                                })
                            })
                            // createFilter(mediaPipeline,'capsfilter caps=video/x-raw,wgcp_participant=' + 4, 'VIDEO').then(function(videoObj){
                            //         filter = videoObj;
                            //         console.log('videoObj', videoObj)
                            //         return getComposite(mediaPipeline);
                            //         //return createFilter(mediaPipeline,'videorate max-rate=2', 'VIDEO');
                            // }).then(function() {
                            //     console.log('!!!!!!!!!!!!!!!!')
                            // })

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


function createHubPort(_composite, callback) {
    _composite.createHubPort( function(error, _hubPort) {
        //iamabook..console.log("***** Creating hubPort *******");
        if (error) {
            console.log(error);
        }else{
            callback(_hubPort);
        }
    });
}

function getKurentoClient(url, callback) {
    kurento(url, function(err, _kurentoClient ) {
        if (err) {
            callback(err, null);
        }
        callback(null, _kurentoClient)
    
    });
}

function getComposite(_pipeline, callback) {
	//iamabook..console.log("***** getComposite ******");
    _pipeline.create( 'Composite',  function( error, _composite ) {
        //console.log("creating Composite");
        if (error) {
            console.log(error);
        }
        composite = _composite;
        console.log("iamabook. COMPOSITE ID IS::: ", _composite.id);

        callback(composite);
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

function createFilter(_pipeline, _command, _type, callback){
	let command = _command;
	let type    = _type;
    console.log('createFilter')
    let options = {
        //command    : 'videoflip method=4',
        //command    : 'videorate max-rate=10',
        command    : command,
        filterType : type
    }
    _pipeline.create('GStreamerFilter', options, function(error, filter){
        if(error){
            console.log(error)
        }else{
            callback(filter)
        }
    });
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