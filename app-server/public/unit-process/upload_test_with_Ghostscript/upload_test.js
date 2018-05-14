var express = require('express');
var url = require('url');
var exec = require('child_process').exec;
var router = express.Router();
var multiparty = require('multiparty'); // 파일 업로드
var fs = require('fs');                 // 파일 시스템
var app = express();
var stream = require('stream');         // 버퍼 스트림

// port 8080
app.listen(8080, function () {
    console.log('[upload_test.js] Test server has started');
        
    
});

// html file loading
app.get('/', function (req, res) {
    console.log('[upload_test.js] upload form loaded');

    // exec('ffmpeg -list_devices true -f dshow -i dummy', {'encoding': 'UTF-8'}, function(err, stdout, stderr) {
    //     console.log('[upload_test.js]' + stderr);
    // });

    res.sendFile(__dirname + '/upload_form.html');
});

// exports.uploadstream = function (req, res) {
//     var destination = __dirname + '\\..\\uploaded\\' + req.files.myfile.name;
//     var ws = fs.createWriteStream(destination);
//     fs.createReadStream(req.files.myfile.path).pipe(ws);
//     res.redirect('back');
// };

app.post('/upload', function (req, res, next) {

    var form = new multiparty.Form({
        autoFiles: false,
        uploadDir: __dirname + '\\tmp\\',
        maxFilesSize: 1024 * 1024 * 200  // 파일 용량 제한
    });

    // file upload exeption
    form.on('error', function (err) {
        console.log('[upload_test.js]' + err);
        throw err;
    });

    // get uploader field key&value
    form.on('field', function (name, value) {
        console.log('[upload_test.js] form name: ' + name + ', value: ' + value);
    });

    // file upload handling
    form.parse(req, function (err, fields, files) {

        for (let fIndex = 0; fIndex < files.attachedFile.length; fIndex++) {

            var filePath = files.attachedFile[fIndex].path;
            var fileOrgn = files.attachedFile[fIndex].originalFilename;
            var changeName = form.uploadDir + Date.now() + fileOrgn;
            var fileExtIdx = changeName.lastIndexOf('.');         // file name extention start index
            // console.log('[upload_test.js] file[' + fIndex + '] oriName: ' + files.attachedFile[fIndex].originalFilename);
            // files.attachedFile[fIndex].path = form.uploadDir + files.attachedFile[fIndex].originalFilename+Date.now();
            // console.log('[upload_test.js] file[' + fIndex + '] newName: ' + files.attachedFile[fIndex].path);
            
            fs.rename(filePath, changeName, function (err){
                if (err) {
                    console.log('[upload_test.js] fs.rename' + err);
                    throw err;
                } else {
                    console.log('[upload_test.js] fs.rename is done');

                    if (changeName.substr(fileExtIdx).toUpperCase() == '.PDF') {
                        console.log('this file is PDF file.');

                        // exec('magick convert -density 300 ' + changeName.substr(0, fileExtIdx)
                        //   + '.pdf -strip ' + changeName.substr(0, fileExtIdx)
                        //   + '.png', function(error) {
                        //     if (error) {
                        //         console.log(error);
                        //     } else {
                        //         console.log('converting is done');
                        //     }
                        // });

                        // pdf Page Count
                        var totalPage;
                        exec('/gs/bin/gswin64c -q -dNODISPLAY -c \"('+changeName.replace(/\\/g,'/')+') (r) file runpdfbegin pdfpagecount = quit\"', function(error, stdout, stderr) {
                            console.log('stdout: '+stdout);
                            totalPage = stdout;
                            console.log('totalPage: '+totalPage);
                        });
                        
                        // pdf to Image with Ghostscript
                        exec('/gs/bin/gswin64c -dQUIET -dPARANOIDSAFER -dBATCH -dNOPAUSE -dNOPROMPT -sDEVICE=png16m -dTextAlphaBits=4 -dGraphicsAlphaBits=4 -r72 -dFirstPage=1 -dLastPage=10 -sOutputFile='+changeName.substr(0, fileExtIdx)+'-%d.png '+changeName.substr(0, fileExtIdx)+'.pdf', function (error, stdout, stderr) {
                            if ( error !== null ) {
                                console.log(error);
                            } else {
                                console.log('Ghostscript done');
                            }
                        });
                    }
                }

                
            });
            console.log('parse path: ' + filePath);
            console.log('parse originalFilename: ' + form.uploadDir + fileOrgn);

        }

        // file List
        var files = fs.readdirSync('tmp');
        res.status(200).send(files);
    });

    // all uploads are completed
    form.on('close', function (err, fields, files) {
        console.log('[upload_test.js] Upload Completed');
    });

    // file upload progress
    form.on('progress', function (byteRead, byteExpected) {
        console.log('[upload_test.js] Reading total  ' + byteRead + '/' + byteExpected);
    });

});

module.exports = router;