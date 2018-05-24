
const path = require('path')

let config = {
    nameSpace: {
		  coreServer: 'CoreServer',
    },
    port: 8000,
    socketEvent: 'gigagenie',
    fieldname: 'parkoon',
    maxfile: 10,
    uploadPath: path.join(__dirname, '../../uploads/'),
}

module.exports = config