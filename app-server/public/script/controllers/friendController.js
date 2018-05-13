document.addEventListener('DOMContentLoaded', function () {

    const getFriendsBtn = document.getElementById('getFriendsBtn');
    console.log(getFriendsBtn)
    console.log(friendsInput)

    
    getFriendsBtn.addEventListener('click', getFriendsBtnHandler);

    function getFriendsBtnHandler(event, callback) {
        const friendsInput = document.getElementById('friendsInput');

        let inputVal = friendsInput.value;
        Friends.getFriends(inputVal, function(err, friends) {
            if (err) throw err;
            
        })
    }

});