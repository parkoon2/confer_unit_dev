const FileShare = (function() {

    function sendFiles(files) {
        let formData = new FormData();
        for (let i = 0 ; i < files.length ; i ++) {
            let file = files[i];
            let ext = file.name.substring(file.name.lastIndexOf('.') + 1).toUpperCase();
            formData.append(ext, file);
        }
        console.log(';2')
        let xhr = new XMLHttpRequest(); 
        xhr.onload = function() {
            if ( xhr.status === 200 || xhr.status === 201 ) {
                console.log( xhr.status, 'TAB Upload Success' ); // 성공
                //resolve( xhr.response )
        
            } else {
                console.error( xhr.status, xhr.responseText ); // 실패
            }
        };
        xhr.open('POST', 'http://localhost:8000/upload' );
        xhr.send(formData); // 폼 데이터 객체 전송
        
    }

    function checkExtension(callback) {
        try {

            let fileCount = 0;
            Array.prototype.forEach.call(this.files, function(file){
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

    return {
        checkExtension,
        sendFiles,
    }
})();




