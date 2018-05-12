document.addEventListener('DOMContentLoaded', function () {
    
    const drawboard = document.getElementById('drawboard');
    const laserboard = document.getElementById('laserboard');
    const eraser = document.getElementById('eraser');
    const highlighter = document.getElementById('highlighter');
    const pen = document.getElementById('pen');
    const colorRed = document.getElementById('color-red');
    const colorBlack = document.getElementById('color-black');

    const thicknessBig = document.getElementById('thickness-big');
    const thicknessSmall = document.getElementById('thickness-small');

    const laserpoint = document.getElementById('laserpoint');

    const DEFAULT_TEXT_SIZE      = 24;
    const DEFAULT_ERASER_SIZE    = 7;
    const DEFAULT_COLOR          = '#000000';
    const DEFAULT_THICKNESS      = 5;
    const TEXTAREA_LINE_HEIGHT_S = 15;
    const TEXTAREA_LINE_HEIGHT_M = 27;
    const TEXTAREA_LINE_HEIGHT_L = 41;
    const DEFAULT_BOARD_WIDTH    = 1295;
    const DEFAULT_BOARD_HEIGHT   = 823;
    const LIST_BOARD_WIDTH       = 1060;
    const LIST_BOARD_HEIGHT      = 823;
    const DEFAULT_TOOLTYPE       = 'tooltype_pen';
    
    WhiteBoard.init({drawboard, laserboard }, function(err) {
        if (err)  throw err;


    
        eraser.addEventListener('click', WhiteBoard.eraserHandler)
        highlighter.addEventListener('click', WhiteBoard.highlighterHandler)
        colorRed.addEventListener('click', WhiteBoard.colorRedHandler)
        colorBlack.addEventListener('click', WhiteBoard.colorBlackHandler)

        laserpoint.addEventListener('click', WhiteBoard.laserpointHandler)
        
        pen.addEventListener('click', WhiteBoard.penHandler)
        thicknessBig.addEventListener('click', WhiteBoard.thicknessBigHandler)
        thicknessSmall.addEventListener('click', WhiteBoard.thicknessSmallHandler)
        
        drawboard.addEventListener('mousedown', WhiteBoard.drawStartHandler);
        drawboard.addEventListener('mouseup', WhiteBoard.drawEndHandler);
        drawboard.addEventListener('mousemove', WhiteBoard.drawMoveHandler);


        laserboard.addEventListener('mousedown', WhiteBoard.laserStartHandler);
        laserboard.addEventListener('mouseup', WhiteBoard.laserEndHandler);
        laserboard.addEventListener('mousemove', WhiteBoard.laserMoveHandler);
        laserboard.addEventListener('mouseout', WhiteBoard.laserOutHandler);
        

    })
});
    
    
