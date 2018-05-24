const electron = require( 'electron' );
const ipc = electron.ipcRenderer;

const closeBtn = document.getElementById('closeBtn')
const minimizeBtn = document.getElementById('minimizeBtn')
const fullscreenBtn = document.getElementById('fullscreenBtn')


closeBtn.addEventListener('click', closeHandler)
minimizeBtn.addEventListener('click', minimizeHandler)
fullscreenBtn.addEventListener('click', fullscreenHandler)

function closeHandler() {
    console.log('close handler')
    ipc.send('menu-control', 'close')
}

function minimizeHandler() {
    console.log('minimize handler')
    ipc.send('menu-control', 'minimize')
}

function fullscreenHandler() {
    console.log('fullscreen handler')
    ipc.send('menu-control', 'fullscreen')
}