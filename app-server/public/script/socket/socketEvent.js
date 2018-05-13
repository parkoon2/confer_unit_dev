const AppSocket = (function() {
    
    function init(data, callback) {
        try {
            let signalSocket = data.io.connect(`${data.signalURL}:${data.signalPort}`);
            callback(signalSocket);
        } catch (err) {
            callback(err);
        }
    }

    function socketEventHandler(data) {
        let op = data.signalOp || data.eventOp;
        console.log('## AppSocket [socketEventHandler] | Siganl --> PC | parkoon', data)
        
        switch (op) {
            case 'Draw':
                WhiteBoard.doDrawing(data, false)
                break;
            case 'Laser':
                WhiteBoard.doLaser(data, false)
                break;
            case 'Friends':
                Common.eventGenerator('getFriends', data)
                break;

        }
    }

    function sendMessage(eventName, message) {
        console.log(`## AppSocket [sendMessage] | PC --> Siganl |`, eventName, message)
        try {
            socketInfo.instance.emit(eventName, message);
        } catch (err) {
            throw err;
        }
    }

    return {
        init,
        socketEventHandler,
        sendMessage
    }

})();










