document.addEventListener('DOMContentLoaded', function () {
    
        const callBtn = document.getElementById('callBtn');
        const joinBtn = document.getElementById('joinBtn');
        const exitBtn = document.getElementById('exitBtn');
        const remoteVideo = document.getElementById('remoteVideo');
        const localVideo = document.getElementById('localVideo');


        let options = {
            localVideo: undefined,
            remoteVideo: remoteVideo,
            onicecandidate : MultiConference.onIceCandidate,
            mediaConstraints: {
                audio: true,
                video: {
                    width: 1280, // 1280
                    height: 720, // 720
                    framerate: 24
                }
            },
        }

        callBtn.addEventListener('click', function() {
            MultiConference.getPeer(options, function(err, peer) {
                console.log('## 피어생성 ##')
                MultiVideo.peer = peer;
                MultiVideo.peer.generateOffer(MultiConference.onOffer)
            });

        })


});    