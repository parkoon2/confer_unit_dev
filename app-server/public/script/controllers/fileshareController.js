document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.getElementById('fileInput');

    fileInput.addEventListener('change', function() {
        alert('이게 두번')
        FileShare.checkExtension.call(this, function(err) {
            if (err) {
                alert(err);
                fileInput.value = '';
                return;
            }
            FileShare.sendFiles(fileInput.files);
        });
    })
})    