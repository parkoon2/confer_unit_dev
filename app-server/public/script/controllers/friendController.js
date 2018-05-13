document.addEventListener('DOMContentLoaded', function () {

    const getFriendsBtn = document.getElementById('getFriendsBtn');
    
    window.addEventListener('getFriends', function(event) {
        const friendsArea = document.getElementById('friendsArea');
        let friends = event.detail.result.friends;
        console.log(friends)
        Friends.updateFriends(friendsArea, friends, function(err) {
            if (err) throw err;
            
            const friendBasket = document.getElementById('friendBasket')
            Friends.addFriendEvent(friendBasket);
        })
    })

    getFriendsBtn.addEventListener('click', getFriendsBtnHandler);

    function getFriendsBtnHandler(event, callback) {
        const friendsInput = document.getElementById('friendsInput');
        let inputVal = friendsInput.value;

        Friends.getFriends(inputVal, function(err, friends) {
            if (err) throw err;
            
        })
    }



});