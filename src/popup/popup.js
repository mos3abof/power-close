'use strict';

const inputArea = document.getElementById('edit-box');

inputArea.focus();

inputArea.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    const text = inputArea.value.trim();
    if (text) {
      chrome.runtime.sendMessage({ event: 'text-entered', text });
      inputArea.value = '';
    }
  } else if (event.key === 'Escape') {
    window.close();
  }
});

document.getElementById('options-link').addEventListener('click', (e) => {
  e.preventDefault();
  chrome.runtime.openOptionsPage();
});
