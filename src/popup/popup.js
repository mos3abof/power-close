var inputArea = document.getElementById("edit-box");

inputArea.focus();

inputArea.addEventListener('keyup', function onkeyup(event) {
    if (event.keyCode == 13) {
        // Remove the newline.
        var text = inputArea.value.replace(/(\r\n|\n|\r)/gm, "");
        chrome.runtime.sendMessage({
            event: 'text-entered',
            text: text
        });
        inputArea.value = '';
    }
}, false);
