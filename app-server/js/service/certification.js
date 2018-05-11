const {getUserId} = require('../repository/db.certification');

function login() {
    return new Promise(function(resolve, reject) {
        getUserId(function(err, result) {
            if (err) {
                reject(err);
            }

            // do something...

            resolve('sth');
        
        })
    })
}

module.exports = {
    login
}