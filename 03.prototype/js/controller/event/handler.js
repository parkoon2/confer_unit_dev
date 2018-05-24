const electron = require('electron')
const {BrowserWindow} = electron // property 이름이라는거!
const url = require('url')
const path = require('path')
const Positioner = require('../../util/position')

let mainWindow, recordWindow, selectWindow, captureWindow, rgbWindow, FFmpegWindow;



function EventHandler(option) { 
    this.app = option.app;
    this.ipcMain = option.ipcMain;
}

let ipcMainHandler = function(event, arg) {
    if (arg === 'close') {
        mainWindow.close()
        return;
    }

    if(arg === 'minimize') {
        mainWindow.minimize()
        return;
    }
}

let ipcRecordHandler = function(event, arg) {
    if (arg === 'start') {
        recordWindow = new BrowserWindow({
            width: 200,
            height: 120,
            frame: false
        })

        let recordPath = path.join('./', 'public/views/record.html')

        recordWindow.loadURL(url.format({
            pathname: recordPath,
            slashes: true,
        }))

        recordWindow.on('closed', function() {
            console.log('recordWindow is closed')
            recordWindow = null
        })
        
        return;
    }

    if(arg === 'stop') {
        recordWindow.close()
        return;
    }
}

let ipcFFmpegHandler = function(event, arg) {
    console.log('arg', arg)
    
    let command = arg.command
    if (command === 'ffmpeg:start') {

        let ffmpegPath = path.join('./', 'public/views/ffmpeg-capture.html')
        
        FFmpegWindow = new BrowserWindow({
            width: 1280,
            height: 720,
            //frame: false
        })

        FFmpegWindow.loadURL(url.format({
            pathname: ffmpegPath,
            slashes: true,
        }))

        FFmpegWindow.webContents.openDevTools()
        

        FFmpegWindow.on('closed', function() {
            console.log('FFmpegWindow is closed')
            FFmpegWindow = null
        })
        return
    }


    if (command === 'ffmpeg:end') {
        FFmpegWindow.close()
        return
    }
}

let ipcRgbHandler = function(event, arg) {
    console.log('arg', arg)
    
    let command = arg.command
    if (command === 'rgb:start') {
        let selectPath = path.join('./', 'public/views/rgb.html')
        
        rgbWindow = new BrowserWindow({
            width: 1280,
            height: 720,
            //frame: false
        })

        rgbWindow.loadURL(url.format({
            pathname: selectPath,
            slashes: true,
        }))

        //rgbWindow.webContents.openDevTools()
        

        rgbWindow.on('closed', function() {
            console.log('rgbWindow is closed')
            rgbWindow = null
        })
        return
    }

    if (command === 'rgb:end') {
        rgbWindow.close()
    }
}

let ipcCaptureHandler = function(event, arg) {
    console.log('arg', arg)
    if (arg === 'start') {

        let selectPath = path.join('./', 'public/views/select.html')
        
        selectWindow = new BrowserWindow({
            width: 500,
            height: 500,
            //frame: false
        })

        selectWindow.loadURL(url.format({
            pathname: selectPath,
            slashes: true,
        }))

        //selectWindow.webContents.openDevTools()
        
        selectWindow.on('closed', function() {
            console.log('selectWindow is closed')
            recordWindow = null
        })

        return;
    }

    if (arg === 'end') {
        if (captureWindow) {
            captureWindow.close()
            return;
        }
        if (selectWindow) {
            selectWindow.close()
            return;
        }
    }

    if (arg.command === 'capture:done') {
        selectWindow.close()

        let capturePath = path.join('./', 'public/views/capture.html')
        captureWindow = new BrowserWindow({
            width: 1200,
            height: 700,
            //frame: false
        })

        captureWindow.loadURL(url.format({
            pathname: capturePath,
            slashes: true,
        }))

        //captureWindow.webContents.openDevTools()
        

        captureWindow.on('closed', function() {
            console.log('selectWindow is closed')
            recordWindow = null
        })

        captureWindow.webContents.on('did-finish-load', function() {
            captureWindow.webContents.send('tmp', arg)
        });
        return;
    }
}

let appCloseHandler = function() {
    console.log( 'window-all-closed' );
    if ( process.platform !== 'darwin' ) {
        this.app.quit()
    }
}

let appBootHandler = function() {

    mainWindow = new BrowserWindow({
        //width: 179,
        width: 250,
        height: 680,
        frame: false,
        //resizable: false,
    });
    
    let winPosision = new Positioner(mainWindow);
    winPosision.set('rightCentor')
    
    // 경로에 띄어씌기와 같은 문자가 들어있으면.. __dirname에 문제생김.
    //let indexPath = path.join(__dirname, '../../public/views/index.html')
    let indexPath = path.join('./', 'public/views/index.html')
    console.log(indexPath)
    mainWindow.loadURL(url.format({
        pathname: indexPath,
        slashes: true,
    }))

    //mainWindow.webContents.openDevTools()

    mainWindow.on('closed', function() {
        console.log('app is closed')
        mainWindow = null
    })

}

EventHandler.prototype.getEvent = function(name) {
    
    let events = {
        ipc_test: ipcMainHandler,
        ipc_record: ipcRecordHandler,
        app_boot: appBootHandler,
        app_close: appCloseHandler,
        ipc_capture: ipcCaptureHandler,
        ipc_rgb: ipcRgbHandler,
        ipc_ffmpeg: ipcFFmpegHandler,
    }
    
    return events[name]
}

EventHandler.prototype.handler = function(name) {
    return this.getEvent(name)
}

module.exports = EventHandler