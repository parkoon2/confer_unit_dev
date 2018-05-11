const config = require('../config/default');

function checkEnvironment(cmd, callback) {
    let env;

    cmd.forEach(function(val, index) {
        if (val === '-t') {
            env = this[index + 1];
        }
    }, cmd);

    switch (env) {
        case 'local':
            setLocalEnv();
            break;
        
        case 'dev':
            setDevelopEnv();
            break;
        
        case 'product':
            setProductEnv();
            break;
        default:
            setLocalEnv();
            break;    
    }
    callback();
}

function setLocalEnv() {
    console.log('setLocalEnv')
    config.port = 8000;
}

function setProductEnv() {
    console.log('setProductEnv')
    config.port = 8001;
}

function setDevelopEnv() {
    console.log('setDevelopEnv')
    config.port = 8002;
}

module.exports = {
    checkEnvironment
}