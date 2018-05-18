document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.getElementById('fileInput');

    fileInput.addEventListener('change', function() {
        FileShare.checkExtension.call(this, function(err) {
            if (err) {
                alert(err);
                fileInput.value = '';
                return;
            }

            let pdf;
            //if (pdf = FileShare.checkPDF(fileInput.files)) {
            //    FileShare.pdfToImage(pdf);
           // } else {
                FileShare.sendFiles(fileInput.files, function(err, result) {
                    if (err) { throw err; }
                    console.log(JSON.parse(result))
                });
            //}
        });
    })
})    