const AppSocket = (function() {
    
    let init = function(data, callback) {
        try {
            let signalSocket = data.io.connect(`${data.signalURL}:${data.signalPort}`);
            callback(signalSocket);
        } catch (err) {
            callback(err);
        }
    }

    let socketEventHandler = function(data) {
        console.log('###############', data);
    }

    let sendMessage = function(eventName, message) {
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










