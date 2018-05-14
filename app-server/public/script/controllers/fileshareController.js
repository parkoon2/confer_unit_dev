document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.getElementById('fileInput');


    fileInput.addEventListener('change', function() {
        FileShare.upload.call(this, function(err) {
            if (err) {
                alert(err);
                fileInput.value = '';
            }
        });
    })
})    