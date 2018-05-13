const Friends = (function() {


    function getFriends(data) {
        try {
            AppSocket.sendMessage(config.socketEventName, {
                eventOp: 'Friends',
                input: data,
            });

        } catch (err) {
            callback(null, err);
        }
    }

    function updateFriends(area, friends, callback) {
        try {
            let count = 0;
            // add element to dom without jQuery
            // http://garystorey.com/2017/02/27/three-ways-to-create-dom-elements-without-jquery/
            friends.forEach(function(val) {
                let name = val.name;
                let email = val.email;
    
                count ++;
                // access to tag data attribute
                // https://developer.mozilla.org/ko/docs/Learn/HTML/Howto/%EB%8D%B0%EC%9D%B4%ED%84%B0_%EC%86%8D%EC%84%B1_%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0
                let domString = `<li><p>${name}/${email}<input name='friend' type='checkbox' value='f${count}' data-name='${name}' data-email='${email}'></p></li>`
                let el = document.createElement('div');
                el.innerHTML = domString;
                area.appendChild(el.firstChild);
    
            })

            callback();
        } catch (err) {
            callback(err);
        }
    }

    function addFriendEvent(basket) {
        let radios = document.getElementsByName('friend');
        
        radios.forEach(function(val, index) {
            val.addEventListener('change', function() {
                console.log('this.checked', this.checked)
                if (this.checked) {
                    console.log
                    addFriend.call(this, basket);
                } else {
                    removeFriend.call(this, basket);
                }
            })
        })
    }
    function addFriend(basket) {
        console.log('basket', basket)
        let el = document.createElement('div');
        let domString = `<li id='${this.value}'><p>${this.dataset.name}/${this.dataset.email}</p></li>`
        el.innerHTML = domString;
        basket.appendChild(el.firstChild);
    }
    function removeFriend(basket) {
        let el = document.getElementById(this.value);

        // outerHTML은 선택한 엘리먼트까지 가져온다.
        // innterHTML은 선택한 엘리먼트의 안쪽만 가져온다.
        el.outerHTML = '';
        delete el;
    }

    function addRightClickEvent(area) {
        let lis = area.getElementsByTagName('li');
        for (let i = 0; i < lis.length ; i ++) {
            lis[i].addEventListener('contextmenu', function(event) {
                event.preventDefault();
                alert('우클릭 메뉴(삭제)')
            })
        }
    }

    return {
        getFriends,
        updateFriends,
        addFriendEvent,
        addRightClickEvent,
    }
})();











