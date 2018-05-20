import { addListener } from "cluster";

document.addEventListener('DOMContentLoaded', function () {
    let fileInput = document.getElementById('fileInput');
    let imageArea = document.getElementById('imageArea');

    // 전송 중에는 파일업로드 막아버리기!
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
                        if (err) throw err
                        sendInfo.files = blob;
                        FileShare.sendFiles(sendInfo, function(err, result) {
                            console.log('[PDF] result', result)
                        })
                    });
                }
                console.log('[ALL] result', result)
                //FileShare.addList(imageArea, result.path)
            });
        });
    })
})    