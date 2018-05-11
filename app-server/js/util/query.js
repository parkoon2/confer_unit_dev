const {getClient} = require('../connector/db.connect');

function doQuery(sql, pram, callback) {
    let client = getClient();
    let _sql, _param, _callback;
    
    let isCallback = false;

    Array.prototype.forEach.call(arguments, function(arg) {
        if (typeof arg === 'function') {
            isCallback = true;
        }
    });

    try {
        if ( !isCallback ) {
            throw '## ERROR ## Callback must be included in arguments';
        }

        if (arguments.length <= 0 && arguments.length > 3) {
            throw '## ERROR ## Specify arguments of doQuery function';
        }

        if (arguments.length === 2) {
            _sql = arguments[0];
            _callback = arguments[1];
            _param = null;
        }
    
        if (arguments.length === 3) {
            _sql = arguments[0];
            _param = arguments[1];
            _callback = arguments[2];
        }
    
        if (_param) {
    
            let re = /\$[0-9]*/g;
            let tmp = _sql.match(re);
    
            tmp.forEach(function(val, index) {
                let newVal = _param[index];
    
                if (typeof newVal === 'string') {
                    newVal = `'${newVal}'`;
                }
    
                _sql = _sql.replace(val, newVal);
            });
        }
        client.query(_sql, function(err, result) {
            if (err) {
                _callback(err, null);
                return;
            }
            _callback(null, result.rows);
        });

    } catch (err) {
        console.log(err);
    } 
}

module.exports = {
    doQuery
}