document.addEventListener('DOMContentLoaded', function () {

    const callBtn = document.getElementById('callBtn');
    const joinBtn = document.getElementById('joinBtn');
    const exitBtn = document.getElementById('exitBtn');
    const remoteVideo = document.getElementById('remoteVideo');
    const localVideo = document.getElementById('localVideo');

    window.addEventListener('successCall', function(event) {
        console.log('## Call Success')
        LocalConference.makePeer(function(err, peer) {
            if (err) throw err;
            Video.peer = peer;
            console.log('## Create video peer successfully', Video.peer);

            Video.peer.onnegotiationneeded = function () {
                console.log("on negotiation called");
            }
        
            Video.peer.onaddstream = function ( event ) {
                console.log("going to add their stream...", event );
                remoteVideo.src = URL.createObjectURL(event.stream);
                exitBtn.disabled = false;
            };

            Video.peer.onicecandidate = function( event ) {
                if (event.candidate) {
                    AppSocket.sendMessage(config.socketEventName, {
                        eventOp: 'Candidate',
                        candidate: event.candidate,
                    })
                }
            }
            LocalConference.getVideostream(function(err, stream) {
                Video.stream = stream;
                localVideo.src = window.URL.createObjectURL(stream);
                Video.peer.addStream(stream);
            });

        });
        // LocalConference.sendJoin({
        //     eventOp: 'Join'
        // })
    });

    window.addEventListener('recvInvite', function(event) {
        console.log('## recvInvite')
        callBtn.disabled = true;
        exitBtn.disabled = true;
        LocalConference.sendJoin({
            eventOp: 'Invite',
            status: 'accept'
        })
    });

    window.addEventListener('successJoin', function(event) {
        console.log('## successJoin');
        LocalConference.makePeer(function(err, peer) {
            if (err) throw err;
            Video.peer = peer;
            console.log('## Create video peer successfully', Video.peer);
           
            Video.peer.onnegotiationneeded = function() {
                console.log("on negotiation called");
            }
        
            Video.peer.onaddstream = function(event) {
                console.log("going to add their stream...", event );
                remoteVideo.src = URL.createObjectURL(event.stream);
                exitBtn.disabled = false;
                //screen.src = URL.createObjectURL( event.stream );
            };


            Video.peer.onicecandidate = function(event) {
                if (event.candidate) {
                    AppSocket.sendMessage(config.socketEventName, {
                        eventOp: 'Candidate',
                        candidate: event.candidate,
                    })
                }
            }

            LocalConference.getVideostream(function(err, stream) {
                if (err) throw err;

                Video.stream = stream;
                localVideo.src = window.URL.createObjectURL(stream);
                
                Video.peer.addStream(stream)

                Video.peer.createOffer(function(offerSdp) {
                    Video.peer.setLocalDescription(offerSdp);
                    
                    AppSocket.sendMessage(config.socketEventName, {
                        eventOp: 'SDP',
                        sdpOffer: offerSdp,
                    })
                    
                }, function(err) {
                    throw err;
                })
            });
        });
    });

    window.addEventListener('getOfferSDP', function(event) {
        let offerSdp = event.detail.result.sdpOffer;
        Video.peer.setRemoteDescription(new RTCSessionDescription(offerSdp));
        Video.peer.createAnswer(function(answerSdp) {
            Video.peer.setLocalDescription(answerSdp)

            AppSocket.sendMessage(config.socketEventName, {
                eventOp: 'SDP',
                sdpAnswer: answerSdp,
            })

        }, function( error ) {
            throw new Error( error );
        });
    });

    window.addEventListener('exitRoom', function() {
        LocalConference.closeVideo({
            peer: Video.peer,
            stream: Video.stream,
            video: [remoteVideo, localVideo],
        });
    })

    window.addEventListener('getAnswerSDP', function(event) {
        let answerSdp = event.detail.result.sdpAnswer;
        Video.peer.setRemoteDescription(new RTCSessionDescription(answerSdp));
    });

    window.addEventListener('getCandidate', function(event) {
        console.log('getCandidate')
        let candidate = event.detail.result.candidate;
        Video.peer.addIceCandidate(new RTCIceCandidate(candidate));
    })
    
    callBtn.addEventListener('click', function(event) {
        joinBtn.disabled = true;
        exitBtn.disabled = true;
        LocalConference.sendCall({
            eventOp: 'Call'
        })
    });

    joinBtn.addEventListener('click', function(event) {
        LocalConference.sendJoin({
            eventOp: 'Join'
        })
    });


    exitBtn.addEventListener('click', function(event) {
        LocalConference.closeVideo({
            peer: Video.peer,
            stream: Video.stream,
            video: [remoteVideo, localVideo],
        });

        AppSocket.sendMessage(config.socketEventName, {
            eventOp: 'ExitRoom',
        })
    });

});    