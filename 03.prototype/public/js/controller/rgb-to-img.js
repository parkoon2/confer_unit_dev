const electron = require('electron')
const ipcRenderer = electron.ipcRenderer

const rgbStartBtn = document.getElementById('rgbStartBtn')
const rgbEndBtn = document.getElementById('rgbEndBtn')

rgbStartBtn.addEventListener('click', rgbStartHandler)
rgbEndBtn.addEventListener('click', rgbEndBtnHandler)

function rgbStartHandler() {
    console.log('여긴데/')
    ipcRenderer.send('rgb-control', {
        command: 'rgb:start'
    })
}

function rgbEndBtnHandler() {

    ipcRenderer.send('rgb-control', {
        command: 'rgb:end'
    })
}

