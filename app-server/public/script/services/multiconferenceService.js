const MultiConference = (function() {
    
    function getPeer(options, callback) {
        try {
            let peer = kurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(options, function(err) {
                if (err) { throw err; }
                callback(null, this) // this >> peer
            });

        } catch (err) {
            callback(err, null);
        }
    }

    function onOffer(err, offerSdp) {
        if (err) { throw err; }

        AppSocket.sendMessage(config.multiEventName, {
            eventOp: 'sdp',
            offerSdp: offerSdp,
        })
    }

    function onIceCandidate(candidate) {
        console.log(' ## Local candidate onIceCandidate')
        AppSocket.sendMessage(config.multiEventName, {
            eventOp: 'candidate',
            candidate: candidate,
        })
    }

    return {
        getPeer,
        onOffer,
        onIceCandidate,
    }
})();