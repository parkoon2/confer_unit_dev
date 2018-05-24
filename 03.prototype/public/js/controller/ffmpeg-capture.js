const electron = require('electron')
const ipcRenderer = electron.ipcRenderer

const ffmpegCaptureStartBtn = document.getElementById('ffmpegCaptureStartBtn')
const ffmpegCaptureEndBtn = document.getElementById('ffmpegCaptureEndBtn')


ffmpegCaptureStartBtn.addEventListener('click', ffmpegCaptureStartHandler)
ffmpegCaptureEndBtn.addEventListener('click', ffmpegCaptureEndHandler)

function ffmpegCaptureStartHandler() {

    ipcRenderer.send('ffmpeg-control', {
        command: 'ffmpeg:start'
    })
}

function ffmpegCaptureEndHandler() {

    ipcRenderer.send('ffmpeg-control', {
        command: 'ffmpeg:end'
    })
}

