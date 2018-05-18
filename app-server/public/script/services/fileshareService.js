const FileShare = (function() {

    let _each = Array.prototype.forEach;

    function sendFiles(files, callback) {
        let formData = new FormData();
        for (let i = 0 ; i < files.length ; i ++) {
            let file = files[i];
            let ext = file.name.substring(file.name.lastIndexOf('.') + 1).toUpperCase();
            formData.append(ext, file);
        }
        let xhr = new XMLHttpRequest(); 
        xhr.onload = function() {
             if ( xhr.status === 200 || xhr.status === 201 ) {
                callback(null, xhr.response)
             } else {
                callback(xhr.responseText, null)
             }
        };
        xhr.open('POST', 'http://localhost:8000/upload' );
        xhr.send(formData); // 폼 데이터 객체 전송
        
    }

    function checkExtension(callback) {
        try {

            let fileCount = 0;
            _each.call(this.files, function(file){
                let name = file.name;
                let ext = name.substring(name.lastIndexOf('.') + 1).toUpperCase();
    
                if (ext !== 'GIF' && ext !== 'PNG' && ext !== 'JPG' && ext !== 'JPEG' && ext !== 'PDF') {
                    throw 'GIF, PNG, JPG, JPEG, PDF 확장자 파일만 업로드할 수 있습니다.';
                }

                fileCount++;
                if (this.files.length === fileCount) {
                    callback();
                }
            }, this);
        } catch (err) {
            callback(err);
        }
    }

    function checkPDF(files) {
        let isPDF = false;
        let pdfCheck = /pdf|PDF/;
        _each.call(files, function(file) {
            let name = file.name;
            if (pdfCheck.test(name)) {
                isPDF = file;
            }
        })
        return isPDF;
    }

    function pdfToImage(file) {
        PDFJS.getDocument(file).then((pdf) => {
            console.log('!!')
        });
    }

    return {
        checkExtension,
        sendFiles,
        checkPDF,
        pdfToImage,
    }
})();




