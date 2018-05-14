const LocalConference = (function() {
    
    const configuration = {
        "iceServers": [{ "url": "stun:stun.1.google.com:19302" }]
    }
    const constraints = {
        video: true,
        audio: true,
    }

    function sendCall(data) {
        AppSocket.sendMessage(config.socketEventName, data)
    }

    function sendJoin(data) {
        AppSocket.sendMessage(config.socketEventName, data)
    }
    
    function makePeer(callback) {
        try {
            let peer = new webkitRTCPeerConnection(configuration);
            callback(null, peer);
        } catch (err) {
            callback(err, null);
        }
    }

    function closeVideo(data) {
        data.peer.close();
        
        for (let track of data.stream.getTracks()) {
            track.stop()
        }

        data.stream = null;
        data.peer = null;

        data.video.forEach(function(v) {
            console.log(v)
            v.src = '';
        });
    }

    function getVideostream(callback) {
        try {
            if (hasUserMedia()) {
                navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
                
                navigator.getUserMedia(constraints, function(stream) {
                    console.log(stream)
                    callback(null, stream)
                }, function(err) {
                    throw err;
                });
            }
        } catch (err) {
            callback(err, null)
        }
    }

    function hasUserMedia() {
        // `!!`를 이용해 객체의 유무를 true/false로 강제 변환
        return !!( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia );
    }

    return {
        sendCall,
        sendJoin,
        makePeer,
        getVideostream,
        closeVideo,
    }

})();