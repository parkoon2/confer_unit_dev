function whiteboard(req, res) {
    res.render('whiteboard', {
        
    })
}

function file(req, res) {
    res.render('fileshare', {
        
    })
}

module.exports = {
    whiteboard,
    file,
}