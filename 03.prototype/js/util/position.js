'use strict'

function Positioner(win, screen) {
    this.win = win
}

Positioner.prototype.getPos = function(pos) {
    const screen = require('electron').screen
    
    let windowWidth = this.win.getSize()[0]
    let windowHeight = this.win.getSize()[1]
    let screenWidth = screen.getPrimaryDisplay().workAreaSize.width
    let screenHeight = screen.getPrimaryDisplay().workAreaSize.height
    
    let positions = {
        rightCentor: {
            x: screenWidth - windowWidth,
            y: (screenHeight / 2) - (windowHeight / 2),
        }
    }

    return positions[pos]
}

Positioner.prototype.set = function(pos) {
    let {x, y} = this.getPos(pos)
    this.win.setPosition(x, y)
}



module.exports = Positioner