document.addEventListener('DOMContentLoaded', function () {
    
        const callBtn = document.getElementById('callBtn');
        const joinBtn = document.getElementById('joinBtn');
        const exitBtn = document.getElementById('exitBtn');
        const remoteVideo = document.getElementById('remoteVideo');
        const localVideo = document.getElementById('localVideo');



        var options = {
            localVideo: undefined,
            remoteVideo: remoteVideo,
            onicecandidate : onIceCandidate,
            mediaConstraints: {
                audio: true,
                video: {
                    width: 1280, // 1280
                    height: 720, // 720
                    framerate: 24
                }
            },
            // onnegotiationneeded: function(){
            //     alert('onnegotiationneeded called');

            // }
        }

        callBtn.addEventListener('click', function() {
            LocalConference.getPeer(options, function(err, peer) {
                MultiVideo.peer = peer;
                console.log(peer)
                MultiVideo.peer.generateOffer(LocalConference.onOffer)
            });

        })

        function onIceCandidate(candidate) {
            console.log('Local candidate' + JSON.stringify(candidate));
          //  if (state == I_CAN_START){
            AppSocket.sendMessage(config.multiEventName, {
                id: 'candidate',
                candidate: candidate,
            })
        }
});    