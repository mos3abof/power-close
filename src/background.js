(function () {
  'use strict';

  // The context menu's path. The popup closes the tabs it counted itself,
  // so the figure it shows and the tabs it closes are the same list.
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

  chrome.contextMenus.create({
    title: 'Close all tabs from this domain',
    onclick: function (event) {
      const keyword = new URL(event.pageUrl).hostname;
      closeTabsByKeyword(keyword);
    }
  });
})();
