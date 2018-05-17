function localconference(req, res) {
    res.render('localconference', {
        
    })
}

function multiconference(req, res) {
    res.render('multiconference', {});
}

module.exports = {
    localconference,
    multiconference
}