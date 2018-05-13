const Common = (function() {
    function eventGenerator(eventName, result) {
        let event = new CustomEvent(eventName, {
            detail: {
                result
            }
        });
        window.dispatchEvent(event); 
    }

    return {
        eventGenerator,
    }
})();