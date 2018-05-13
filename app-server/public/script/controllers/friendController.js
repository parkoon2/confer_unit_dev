document.addEventListener('DOMContentLoaded', function () {

    const getFriendsBtn = document.getElementById('getFriendsBtn');
    
    window.addEventListener('getFriends', function(event) {
        const friendsArea = document.getElementById('friendsArea');
        let friends = event.detail.result.friends;
        console.log(friends)
        Friends.updateFriends(friendsArea, friends, function(err) {
            if (err) throw err;
            
            const friendBasket = document.getElementById('friendBasket');
            Friends.addFriendEvent(friendBasket);
            Friends.addRightClickEvent(friendsArea);
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

    /**
     * 이건 유효성 체크 모듈... 나중에 따로 붙여 쓸 것!
     */

    const firstPass = document.getElementById('firstPass');
    const secondPass = document.getElementById('secondPass');
    const email = document.getElementById('email');
    const passOk = document.getElementById('passOk');
    const mailOk = document.getElementById('mailOk');

    passOk.addEventListener('click', function() {
        if (User.checkPassword(firstPass.value) && User.checkPassword(secondPass.value)) {
            console.log(firstPass.value, secondPass.value)
            if (User.comparePassword(firstPass.value, secondPass.value)) {
                alert('진행하자!');
            }
        }
    });

    mailOk.addEventListener('click', function() {
        if (User.checkEmail(email.value)) {
            alert('진행하자!');
        }
    })

    firstPass.addEventListener('focusout', function() {
        if (this.value) {
            User.checkPassword(this.value);
        }
    });

    secondPass.addEventListener('focusout', function() {
        if (this.value) {
            User.checkPassword(this.value);
        }         
    });

    email.addEventListener('focusout', function() {
        if (this.value) {
            User.checkEmail(this.value);
        }
    });



});