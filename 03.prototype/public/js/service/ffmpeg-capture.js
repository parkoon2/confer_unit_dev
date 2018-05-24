(() => {
    const path = require('path')
    const spawn = require('child_process').spawn
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d');
    const ffmpeg = path.join(__dirname, '../../../ffmpeg')

    let child
    let args = [
        '-y', 
        '-f', 'gdigrab',
        //'-rtbufsize', '2000M',
        '-framerate', '12',
        '-offset_x', '0', 
        '-offset_y', '0', 
        '-video_size', '1920x1080', 
        '-i', 'desktop',
        '-f', 'image2pipe',
        '-vf', 'scale=1280:trunc(ow/a/2)*2',
        '-pix_fmt', 'yuv420p',
        //'-qscale:v', '5',
         '-bufsize', '4M',
         '-b:v', '7.5M',
         '-maxrate', '7.5M',
        '-r','12',
       'pipe:1'
        //'./testtest.png'
    ]
    child = spawn(ffmpeg, args);
    
    var img = new Image();
    let p = true
    let tmp = [];

    img.onload = function() {
        //console.log('@@@@@@@@@@@@@@@@@@@@@@')
        
        draw()

    }

    function draw() {
       // canvas.width = img.width;
        //canvas.height = img.height;
       canvas.width = 1920;
       canvas.height = 1080;
        //ctx.drawImage(img, 0, 0, img.width, img.height);
        ctx.drawImage(img, 0, 0, 1920, 1080);
        
    }

    function makeImg(buf) {
        //console.log(buf)
        var blob = new Blob([buf], {type:'image/jpeg'})
        //console.log(blob.size)
       // if (blob.size > 90000) {
            var url = URL.createObjectURL(blob);
            img.src = url;

       // }
    }
    
    img.onerror = function (err) {
        //console.log('################################', err)
        //draw()
    }
    let t = 0

    child.stdout.on('data', function (buf) {
        //tmp.push(buf)
        t ++;
        //if (p) {
            p = false;
        //console.log('buf', buf)
        
       // if (t % 10 === 0) {
            makeImg(buf)
        //}
        //}

    })

    child.stderr.on('data', function (data) {
        console.log('stderr:' + data);
    });

      
    child.stdin.on('data', function (data) {
        console.log('stdin:' + data);
    });

    child.on('close', function (code) {
        console.log('closing code: ' + code);
    })
})()


