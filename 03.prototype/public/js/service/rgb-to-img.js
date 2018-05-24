(() => {
    
    const fs = require('fs')
    const path = require('path')
    const electron = require('electron')
    const ipcRenderer = electron.ipcRenderer
    
    let readInterval
    let readTime = parseInt(1000/12)
    let rgbData;
    let imgData;

    let xres = 1920;
    let yres = 1080;

    let isRgbTurn = false;

    let canvas = document.getElementById('canvas')
    let rgbPath = path.join(__dirname, '../../tmp/cap.rgb')
    let imgPath = path.join(__dirname, '../../tmp/test.jpg')


    canvas.width = xres
    canvas.height = yres

    fs.readFile(rgbPath, function(err, data){
        rgbData = data; 
        fs.readFile(imgPath, function(err, data){
            imgData = data
            readInterval = setInterval(readFunc, readTime)
        });
    })
    
    function readFunc() {

        if (!isRgbTurn) {

            isRgbTurn = true

            let img = new Image();
            let blob = new Blob([new Uint8Array(imgData)], {type : 'image/jpg'})
            let ctx = canvas.getContext('2d')
            
            img.src = URL.createObjectURL(blob)
            img.onload = function() {
              ctx.drawImage(img, 0, 0)
            }
            
        } else {
            isRgbTurn = false
            
            let ctx = canvas.getContext('2d')
            let imageData = ctx.createImageData(xres, yres)

            for (let y = 0; y < yres; y++) {
                for (let x = 0; x < xres; x++) {
                    let pos = y * xres + x;
                    imageData.data[4 * pos + 0] = rgbData[4 * pos + 0]
                    imageData.data[4 * pos + 1] = rgbData[4 * pos + 1]
                    imageData.data[4 * pos + 2] = rgbData[4 * pos + 2]
                    imageData.data[4 * pos + 3] = rgbData[4 * pos + 3]
                }
            }

            ctx.putImageData(imageData, 0, 0)
        }
    }
})()