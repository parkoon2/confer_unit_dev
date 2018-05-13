const WhiteBoard = (function() {
   
    let drawboard, drawContext, laserboard, laserContext;
    let x, y, status, tooltype;
    let drawData;

    let lineSize = 7;
    let eraserSize = 7;

    let laser = {
        pos: [],
        width: 24,
        height: 24,
        pointer: null,
        enable: false      
    }

    let draw = {
        enable: false
    }

    function init(data, callback) {
        console.log('## whiteboard service [init]', data);
        try {
            drawboard = data.drawboard;
            drawContext = drawboard.getContext('2d');

            laserboard = data.laserboard;
            laserContext = laserboard.getContext('2d');
            callback();
        } catch (err) {
            callback(err);
        }
    }

    
    function drawStartHandler(event) {
        
        // If you are using laser pointer, you are not able to use drawing
        if (!laser.enable) draw.enable = true;
        
        if (draw.enable) {
            let bounds = event.target.getBoundingClientRect();
            x = event.pageX - bounds.left - scrollX;
            y = event.pageY - bounds.top - scrollY;
            status = 'start';
            
            if (tooltype === 'pen') {
                doDrawing({
                    x,
                    y,
                    status
                }, true)
            }            
        }
    }

    function drawEndHandler(event) {
        draw.enable = false;
        drawContext.closePath();
    }

    function drawMoveHandler(event) {
        let bounds = event.target.getBoundingClientRect();
        x = event.pageX - bounds.left - scrollX;
        y = event.pageY - bounds.top - scrollY;
        if (draw.enable) {
        
            status = 'move'

            if (tooltype === 'pen') {
                doDrawing({
                    x,
                    y,
                    status
                }, true)
            }
        
        }
    }

    function penHandler(event) {
        console.log('## whiteboard controller [ penHandler ]')
        // 임시..
        // 나중에 레이저 포인터 아이콘에서 포커스 사라졌을 때 처리할 것!
        laser.enable = false;


        tooltype = 'pen';
       
        drawContext.globalCompositeOperation = 'source-over';
        drawContext.lineWidth = lineSize;
        drawContext.strokeStyle = '#000000';
        drawContext.lineJoin = 'round';
        drawContext.lineCap = 'round';

        
    }

    function laserStartHandler(event) {

    }



    function laserMoveHandler(event) {
        let bounds = event.target.getBoundingClientRect();
        x = event.pageX - bounds.left - scrollX;
        y = event.pageY - bounds.top - scrollY;

        doLaser({
            x,
            y,
        }, true)
    }

    function laserOutHandler(event) {
        if (laser.enable) {
            laserContext.clearRect(laser.pos[0].x, laser.pos[0].y , laser.width, laser.height);
        }
    }

    function laserEndHandler(event) {
        
    }

    function laserpointHandler(event) {
        console.log('## whiteboard controller [ laserpointHandler ]')
        laser.enable = true
    }

    function eraserHandler(event) {
        console.log('## whiteboard controller [ eraserHandler ]')
        drawContext.globalCompositeOperation = 'destination-out';
        drawContext.fillStyle = '#ffffff';
        drawContext.strokeStyle = '#ffffff';
        drawContext.lineWidth = _toolbar.eraser.size;
    }

    function highlighterHandler(event) {
    console.log('## whiteboard controller [ highlighterHandler ]')
        drawContext.globalCompositeOperation = 'destination-atop';
        drawContext.strokeStyle = 'rgba(255,255,0,0.4)';
    }

    function colorRedHandler(event) {
        drawContext.strokeStyle = '#ff0000';
        console.log('## whiteboard controller [ colorRedHandler ]')
        
        
    }

    function colorBlackHandler(event) {
        drawContext.strokeStyle = '#000000';
        console.log('## whiteboard controller [ colorBlackHandler ]')
    }

    function thicknessBigHandler(event) {
        if (lineSize < 12) {
            lineSize ++;
            console.log('증가')
        }
        console.log(drawContext.lineWidth)
        drawContext.lineWidth = lineSize;
    }
    function thicknessSmallHandler(event) {
        if (lineSize > 3) {
            lineSize --;
        }
        drawContext.lineWidth = lineSize;
    }

    function doDrawing(data, emit) {
        
        if (data.status === 'start') {
            drawContext.beginPath();
            drawContext.moveTo(data.x, data.y);
            drawContext.lineTo(data.x, data.y);
            drawContext.stroke();
        }
        
        if (data.status === 'move') {
            drawContext.lineTo(data.x, data.y);
            drawContext.stroke();
        }

        if (data.status === 'end') {
        }

        // when you recive the event(when you are reciver), you are not able to call this function
        if (!emit) { return; }
        AppSocket.sendMessage(config.socketEventName, {
            signalOp: 'Draw',
            x: data.x,
            y: data.y,
            status
        })
    }

    function doLaser(data, emit) {

        // laser.enable value is for Sender
        // emit value is for Reciever
        if (laser.enable || !emit) {
            console.log('zz')
            pointer = new Image();
            pointer.src = '../image/point.png'; 
            pointer.onload = function() {
                drawboard.style.cursor = 'none';
                laserboard.style.cursor = 'none';

                laser.width = pointer.width
                laser.height = pointer.height
                
                laser.pos.push({
                    x: data.x,
                    y: data.y,
                });
                if (laser.pos.length === 2) {
                    laserContext.clearRect(laser.pos[0].x, laser.pos[0].y , laser.width, laser.height);
                    laser.pos.shift()
                    
                }
                laserContext.drawImage(pointer, laser.pos[0].x, laser.pos[0].y); // clearRect
            }

            if (!emit) { return; }

            AppSocket.sendMessage(config.socketEventName, {
                eventOp: 'Laser',
                x: data.x,
                y: data.y,
            })
        }
    }

    function onDrawingEvent() {

    }

    function throttle(callback, delay) {
        let previousCall = new Date().getTime();

        return function() {
          let time = new Date().getTime();
          if ((time - previousCall) >= delay) {
            previousCall = time;
            callback.apply(null, arguments);
          }
        };
      }

    return {
        init,
        doDrawing,
        drawStartHandler,
        drawEndHandler,
        drawMoveHandler,
        penHandler,
        eraserHandler,
        highlighterHandler,
        colorBlackHandler,
        colorRedHandler,
        thicknessBigHandler,
        thicknessSmallHandler,
        laserpointHandler,
        laserStartHandler,
        laserMoveHandler,
        laserEndHandler,
        laserOutHandler,
        throttle,
        doLaser,
    }
})();