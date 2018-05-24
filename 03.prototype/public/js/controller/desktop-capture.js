const electron = require( 'electron' )
const ipcRenderer = electron.ipcRenderer

const deskCaptureBtn = document.getElementById('deskCaptureBtn')
const deskCaptureEndBtn = document.getElementById('deskCaptureEndBtn')
const video = document.getElementById('video')
const canvas = document.getElementById('canvas')

// 소스정리 필요..
if (deskCaptureBtn) {
    deskCaptureBtn.addEventListener('click', deskCaptureHandler)
}

if (deskCaptureEndBtn) {
  deskCaptureEndBtn.addEventListener('click', () => {
    ipcRenderer.send('capture-control', 'end')
  })
}

function deskCaptureHandler() {
    ipcRenderer.send('capture-control', 'start')
}

ipcRenderer.on('tmp', function(event, arg) {
    if (arg.command === 'capture:done') {
        navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
              mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: arg.id,
                minWidth: 500,
                maxWidth: 500,
                minHeight: 720,
                maxHeight: 720
              }
            }
          })
          .then((stream) => handleStream(stream))
          .catch((e) => handleError(e))
    }
    console.log('ipcRenderer', arg)
})



function handleStream (stream) {
    console.log(stream)
    video.srcObject = stream
    video.onloadedmetadata = (e) => video.play()
  }


  function handleError (e) {
    console.log(e)
  }