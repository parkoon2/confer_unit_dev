const Friends = (function() {


    function getFriends(data) {
        try {
            console.log(data)

        } catch (err) {
            callback(null, err)
        }
    }
    return {
        getFriends,
    }
})();