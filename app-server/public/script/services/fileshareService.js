const FileShare = (function() {

    let _each = Array.prototype.forEach;

    function sendFiles(data, callback) {
        try {
            let {files, url, filedname } = data;
            
            let formData = new FormData();
            if (hasLengthProperty(files)) {
                for (let i = 0 ; i < files.length ; i ++) {
                    formData.append(filedname, files[i]);
                }
            } else {
                formData.append(filedname, files);
            }
            
            sendToServer(formData, url, function(err, result) {
                if (err) { throw err; }
                callback(null, result);
            });
      
        } catch(err) {
            callback(err, null);
        }
    }

    function sendToServer(data, url, callback) {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.send(data); 
        xhr.onload = function() {
             if ( xhr.status === 200 || xhr.status === 201 ) {
                callback(null, JSON.parse(xhr.response));
             } else {
                callback(xhr.responseText, null)
             }
        }
    }

    function hasLengthProperty(obj) {
        try {
            if ('length' in obj) {
                return true;
            }
            throw 'no length prop';
        } catch (e) {
            return false
        }
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
        let result = false;
        let pdfCheck = /pdf|PDF/;
        _each.call(files, function(file) {
            let mimetype = file.mimetype;
            let path = file.path
            if (pdfCheck.test(mimetype)) {
                result = path;
            }
        })
        return result;
    }

    function addList(desti, source) {
        console.log(desti, source)
    }

    function pdfToCanvasBlob(file, callback) {
        try {
            let scale = 1;
            PDFJS.getDocument(file).then(function(pdf) {
                let pages = pdf.numPages;
                let index = 1;
                for ( ; index <= pages; index ++) {
                    pdf.getPage(index).then(function(page) {
    
                        let canvas = document.createElement('canvas');
                        let canvasContext = canvas.getContext('2d');
                        let viewport = page.getViewport(scale);
    
                        document.getElementById('holder').appendChild(canvas);
    
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;
    
                        let renderTask = page.render({canvasContext, viewport});
                        
                        renderTask.promise.then(function() {
                            canvas.toBlob(function(blob) {
                                callback(null, blob)
                            }, 'image/jpeg');
                        });
                    });
                }
            });

        } catch (err) {
            callback(err, null)
        }
    }




    return {
        checkExtension,
        sendFiles,
        checkPDF,
        pdfToCanvasBlob,
        addList,
    }
})();




