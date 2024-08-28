(function () {
    'use strict';

    const inputArea = document.getElementById('edit-box');

    inputArea.focus();

    inputArea.addEventListener('keyup', function onkeyup(event) {
        if (event.keyCode === 13) {
            chrome.runtime.sendMessage({
                event: 'text-entered',
                text: inputArea.value.trim()
            });
            inputArea.value = '';
        }
    }, false);
})();
