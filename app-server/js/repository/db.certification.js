const {selectUserId} = require('./queries');
const {doQuery} = require('../util/query');

function getUserId(callback) {
    doQuery(selectUserId.query, selectUserId.param, function(err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, result);
    });
}

module.exports = {
    getUserId,
}







