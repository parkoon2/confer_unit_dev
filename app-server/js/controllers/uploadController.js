
const uploadConf = require('../../js/config/upload');

function fileupload(req, res, next) {
    console.log('!')
    //let files = JSON.stringify(req.files);
    let files = req.files;
    let result = [];
    console.log('files', files)
    files.forEach(function(file) {
        let mimetype = file.mimetype;
        let filename = file.filename;
        // 근데 경로가 너무 쉬운거 아닌가...?
        // 스트링으로 접근하기 힘든... 폴더를 하나 만들어야하나..?
        let path = `${uploadConf.url}:${uploadConf.port}/${uploadConf.dir}/${filename}`;
        result.push({
            mimetype,
            filename,
            path
        });
    })
    //console.log(req.body); //form fields
    //console.log(req.files); //form files
   res.status(200).send(result);
}


module.exports = {
    fileupload,
}