const fs = require('fs')
const path = require('path')
const spawn = require('child_process').spawn
const electron = require( 'electron' )
const ipc = electron.ipcRenderer;

// const recStartBtn = document.getElementById('recStartBtn')
// const recEndBtn = document.getElementById('recEndBtn')

// recStartBtn.addEventListener('click', recStartHandler)
// recEndBtn.addEventListener('click', recEndHandler)

let isRecord = false
let child;

function recStartHandler() {
    if (!isRecord) {
        console.log('record start')
        ipc.send('record-control', 'start')

        const RECOED_PATH = 'C:\\temp_record'
        const TYPE = 'webm'
        const ffmpeg = path.join(__dirname, '../../../ffmpeg')
        isRecord = true;
    
        try {
            fs.mkdirSync(RECOED_PATH)
        } catch(e) {
            if (e.code != 'EEXIST') {
                throw e; // 존재할경우 패스처리함. 
            }
        }
    
        let now = new Date();
        let fileName = `${now.getDate()}d${now.getHours()}h${now.getMinutes()}m${now.getSeconds()}s`
        let args = [
            '-f', 'gdigrab', 
            '-framerate', '12', 
            '-offset_x', '0', 
            '-offset_y', '0', 
            '-video_size', '1920x1080', 
            '-i', 'desktop', 
            `${RECOED_PATH}\\${fileName}.${TYPE}`
        ]

        child = spawn(ffmpeg, args);
      
        child.stdout.on('data', function (data) {
          //console.log('stdout:::::::::' + data)
        });
        
        child.stderr.on('data', function (data) {
          //console.log('stderr:' + data)
        });
  
        child.stdin.on('data', function (data) {
          //console.log('stdin:' + data)
        });
        
        child.on('close', function (code) {
          //console.log('closing code: ' + code)
          //Here you can get the exit code of the script
        });

    }
}

function recEndHandler() {
    if (child && isRecord) {
        console.log('record end')
        ipc.send('record-control', 'stop')
        
        isRecord = false;
        child.stdin.setEncoding('utf-8')
        child.stdout.pipe(process.stdout)
        child.stdin.write('q')
        child.stdin.end()
        child = null
    }
}
