const FileShare = (function() {

    // function upload(callback) {
    //     try {
    //         Array.prototype.forEach.call(this.files, function(file){
    //             console.log(file);
    //             let name = file.name;
    //             let ext = name.substring(name.lastIndexOf('.') + 1).toUpperCase();
    
    //             if (ext !== 'GIF' && ext !== 'PNG' && ext !== 'JPG' && ext !== 'JPEG' && ext !== 'PDF') {
    //                 throw 'GIF, PNG, JPG, JPEG, PDF 확장자 파일만 업로드할 수 있습니다.';
    //             }
    //             callback();
    //             this.form.submit();
    //         }, this);
    //     } catch (err) {
    //         callback(err);
    //     }
    // }

    function upload(callback) {
        try {

            let formData = new FormData();

            // Array.prototype.forEach.call(this.files, function(file){
                
            //     formData.append('zzzzzzzfile','fgfg', file);

            //     let name = file.name;
            //     let ext = name.substring(name.lastIndexOf('.') + 1).toUpperCase();
    
            //     if (ext !== 'GIF' && ext !== 'PNG' && ext !== 'JPG' && ext !== 'JPEG' && ext !== 'PDF') {
            //         throw 'GIF, PNG, JPG, JPEG, PDF 확장자 파일만 업로드할 수 있습니다.';
            //     }



            //     //callback();
            //     //this.form.submit();
                


            // }, this);

            formData.append('zzzzzzzfile',this.files[0]);
            console.log(formData)
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



        } catch (err) {
            callback(err);
        }
    }

    return {
        upload,
    }
})();




