(function () {
  'use strict';
  function closeTabsByKeyword(keyword) {
    if (!keyword) {
      return;
    }

    chrome.tabs.query({}, function (tabs) {
      for (const tab of tabs) {
        if (tab.url.indexOf(keyword) !== -1) {
          chrome.tabs.remove(tab.id);
        }
      }
    });
  }

  chrome.runtime.onMessage.addListener(function (response) {
    if (response.event !== 'text-entered') {
      return;
    }

    closeTabsByKeyword(response.text);
  });

  chrome.contextMenus.create({
    title: 'Close all tabs from this domain',
    onclick: function (event) {
      const keyword = new URL(event.pageUrl).hostname;
      closeTabsByKeyword(keyword);
    }
  });
})();
