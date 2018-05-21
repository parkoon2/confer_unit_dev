document.addEventListener('DOMContentLoaded', function () {
    let fileInput = document.getElementById('fileInput');
    let imageArea = document.getElementById('imageArea');

    // 전송 중에는 파일업로드 막아버리기!
    // PDF는 1개씩! 단, PDF + N개 이미지 가능!
    fileInput.addEventListener('change', function() {
        FileShare.checkExtension.call(this, function(err) {
            if (err) {
                alert(err);
                fileInput.value = '';
                return;
            }
            
            let sendInfo = {
                files: fileInput.files,
                url:'http://localhost:8000/upload', 
                filedname: 'parkoon',
            }

            FileShare.sendFiles(sendInfo, function(err, result) {
                if (err) { throw err; }
                fileInput.value = '';
                let pdf;
                if (pdf = FileShare.checkPDF(result)) {
                    FileShare.pdfToCanvasBlob(pdf, function(err, blob) {
                        if (err) { throw err; }
                        sendInfo.files = blob;
                        FileShare.sendFiles(sendInfo, function(err, result) {
                            if (err) { throw err; }
                            console.log('[PDF] result', result)
                            FileShare.addList(imageArea, result[0].path);
                            FileShare.addEventToTarget(imageArea);
                        })
                    });
                } 

                // PDF 를 제외하고!
                // PDF와 이미지를 동시에 올렸을 때!
                console.log('[ALL] result', result)
                result
                .filter(function(file) {
                    let ext = file.mimetype.split('/')[1].toUpperCase();
                    console.log('ext', ext)
                    return ext !== 'PDF';
                })
                .forEach(function(file) {
                    FileShare.addList(imageArea, file.path);
                    FileShare.addEventToTarget(imageArea);
                })
            });
        });
    })
})    