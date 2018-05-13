const User = (function() {

    function checkPassword(pwd){
        let num = pwd.search(/[0-9]/g);
        let eng = pwd.search(/[a-z]/ig);
        let spe = pwd.search(/[`~!@@#$%^&*|₩₩₩'₩';:₩/?]/gi);
       
        if (pwd.length < 6 || pwd.length > 20) {
            alert('6자리 ~ 20자리 이내로 입력해주세요.');
            return false;
        }
        if (pwd.search(/₩s/) !== -1) {
            alert('비밀번호는 공백없이 입력해주세요.');
            return false;
        } 
        if (num < 0 || eng < 0 || spe < 0 ) {
       
            alert('영문, 숫자, 특수문자를 혼합하여 입력해주세요.');
            return false;
        }
        return true;
    }

    function checkEmail(email) {
        let re = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;

        if (!re.test(email)) {
            alert("이 메일형식이 올바르지 않습니다.");
            return false;
        }
        return true
    }

    function comparePassword(p1, p2) {
        console.log(p1, p2)
        if (p1 === p2) {
            return true;
        }
        alert('입력하신 비밀번호가 일치하지 않습니다.');
        return false
    }
       
    return {
        checkPassword,
        comparePassword,
        checkEmail,
    }
})();