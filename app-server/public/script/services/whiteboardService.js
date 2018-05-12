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

    let init = function(data, callback) {
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

    
    let drawStartHandler = function(event) {
        
        // If you are using laser pointer, you are not able to use drawing
        if (!laser.enable) draw.enable = true;
        
        if (draw.enable) {
            let bounds = event.target.getBoundingClientRect();
            x = event.pageX - bounds.left - scrollX;
            y = event.pageY - bounds.top - scrollY;
            status = 'start';
            
            if (tooltype === 'pen') {
                doDraw({
                    x,
                    y,
                    status
                })
            }            
        }
    }

    let drawEndHandler = function(event) {
        draw.enable = false;
        console.log('ss')
        drawContext.closePath();
    }

    let drawMoveHandler = function(event) {
        let bounds = event.target.getBoundingClientRect();
        x = event.pageX - bounds.left - scrollX;
        y = event.pageY - bounds.top - scrollY;
        if (draw.enable) {
        
        
            status = 'move'

            if (tooltype === 'pen') {
                doDraw({
                    x,
                    y,
                    status
                })
            }
        
        }
    }

    let penHandler = function(event) {
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

    let laserStartHandler = function(event) {

    }



    let  laserMoveHandler = function(event) {
        let bounds = event.target.getBoundingClientRect();
        x = event.pageX - bounds.left - scrollX;
        y = event.pageY - bounds.top - scrollY;

        
        if (laser.enable) {
            pointer = new Image();
            pointer.src = '../image/point.png'; 
            pointer.onload = function() {
                drawboard.style.cursor = 'none';
                laserboard.style.cursor = 'none';

                laser.width = pointer.width
                laser.height = pointer.height
                
                laser.pos.push({x, y})
                if (laser.pos.length === 2) {
                    laserContext.clearRect(laser.pos[0].x, laser.pos[0].y , laser.width, laser.height);
                    laser.pos.shift()
                    
                }
                laserContext.drawImage(pointer, laser.pos[0].x, laser.pos[0].y); // clearRect
                
            }
        }
    }

    let laserOutHandler = function(event) {

        laserContext.clearRect(laser.pos[0].x, laser.pos[0].y , laser.width, laser.height);
    }

    let laserEndHandler = function(event) {
        
    }

    let laserpointHandler = function(event) {
        console.log('## whiteboard controller [ laserpointHandler ]')
        laser.enable = true
    }

    let eraserHandler = function(event) {
        console.log('## whiteboard controller [ eraserHandler ]')
        drawContext.globalCompositeOperation = 'destination-out';
        drawContext.fillStyle = '#ffffff';
        drawContext.strokeStyle = '#ffffff';
        drawContext.lineWidth = _toolbar.eraser.size;
    }

    let highlighterHandler = function(event) {
        console.log('## whiteboard controller [ highlighterHandler ]')
        drawContext.globalCompositeOperation = 'destination-atop';
        drawContext.strokeStyle = 'rgba(255,255,0,0.4)';
    }

    let colorRedHandler = function(event) {
        drawContext.strokeStyle = '#ff0000';
        console.log('## whiteboard controller [ colorRedHandler ]')
        
        
    }

    let colorBlackHandler = function(event) {
        drawContext.strokeStyle = '#000000';
        console.log('## whiteboard controller [ colorBlackHandler ]')
    }

    let thicknessBigHandler = function(event) {
        if (lineSize < 12) {
            lineSize ++;
            console.log('증가')
        }
        console.log(drawContext.lineWidth)
        drawContext.lineWidth = lineSize;
    }
    let thicknessSmallHandler = function(event) {
        if (lineSize > 3) {
            lineSize --;
        }
        drawContext.lineWidth = lineSize;
    }

    let doDraw = function(data) {

        if (data.status === 'start') {
            drawContext.beginPath();
            drawContext.moveTo(data.x, data.y);
            drawContext.lineTo(data.x, data.y);
            drawContext.stroke();
            
            return;
        }
        
        if (data.status === 'move') {
            console.log(drawContext.lineWidth)
            drawContext.lineTo(data.x, data.y);
            drawContext.stroke();
            return;
        }

        if (data.status === 'end') {
            return;
        }
    }
    
    return {
        init,
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
    }
    
})();