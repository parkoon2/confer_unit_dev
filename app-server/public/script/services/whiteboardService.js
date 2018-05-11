const WhiteBoard = (function() {
   
    let drawboard, drawContext, laserboard, laserContext;
    let isDrawing = false;
    let isLaserpointing = false;
    let x, y, status, tooltype;
    let drawData;

    let lineSize = 7;
    let eraserSize = 7;

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
        
        if (!isLaserpointing) isDrawing = true;
        
        if (isDrawing) {
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
        isDrawing = false;
        console.log('ss')
        drawContext.closePath();
    }

    let drawMoveHandler = function(event) {
        let bounds = event.target.getBoundingClientRect();
        x = event.pageX - bounds.left - scrollX;
        y = event.pageY - bounds.top - scrollY;
        if (isDrawing) {
        
        
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
        isLaserpointing = false;


        tooltype = 'pen';
       
        drawContext.globalCompositeOperation = 'source-over';
        drawContext.lineWidth = lineSize;
        drawContext.strokeStyle = '#000000';
        drawContext.lineJoin = 'round';
        drawContext.lineCap = 'round';

        
    }

    let laserStartHandler = function(event) {

    }

    let tempX = [];
    let tempY = []; 

    let  laserMoveHandler = function(event) {
        let bounds = event.target.getBoundingClientRect();
        x = event.pageX - bounds.left - scrollX;
        y = event.pageY - bounds.top - scrollY;

        if (isLaserpointing) {
            var imgTag = new Image();
            imgTag.src = '../image/point.png'; 
            imgTag.onload = function() {
                drawboard.style.cursor = 'none';
                //laserboard.style.cursor = 'none';
                //clearRect(xcoordinate_of_img1,ycoordinate_of_img1,xcoordinate_of_img1 + img1.width ,ycoord_of_img1 +img1.height );
                
                console.log('@@@@@@@@@@@@@@@@@@ 그리고', x)
                // 지우고 그렵   ㅗ자
                laserContext.drawImage(imgTag, x, y); // clearRect
                laserContext.clearRect(x, y , imgTag.width, imgTag.height);
                
                tempX.push(x);
                tempY.push(y);

                if (tempX.length === 2) {
                    console.log('################# 지우고', tempX[0])
                    laserContext.clearRect(tempX[0], tempY[0] , imgTag.width, imgTag.height);
                    tempX.shift()
                    tempY.shift()
                } else {
                    console.log('안지운다')
                }
                
                // if (x좌표 ||)
                
              

                
            }
        }
    }

    let  laserEndHandler= function(event) {
        
    }

    let laserpointHandler = function(event) {
        console.log('## whiteboard controller [ laserpointHandler ]')
        isLaserpointing = true
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
    }
    
})();