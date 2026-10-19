(function () {
  'use strict';

  // Initialize context menus when the extension is installed or updated
  chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.removeAll(() => {
      chrome.contextMenus.create({
        id: 'close-tabs-by-domain',
        title: 'Close all tabs from this domain',
        contexts: ['page']
      });
    });
  });

  // The context menu's path. The popup closes the tabs it counted itself,
  // so the figure it shows and the tabs it closes are the same list.
  function closeTabsByKeyword(keyword) {
    if (!keyword) {
      return;
    }

    const lowerKeyword = keyword.toLowerCase();
    chrome.tabs.query({}, function (tabs) {
      for (const tab of tabs) {
        if (tab.url && tab.url.toLowerCase().indexOf(lowerKeyword) !== -1) {
          chrome.tabs.remove(tab.id);
        }
      }
    });
  }

  // Handle messages if sent from other contexts
  chrome.runtime.onMessage.addListener(function (response) {
    if (response && response.event === 'text-entered') {
      closeTabsByKeyword(response.text);
    }
  });

  // Handle context menu clicks in Manifest V3
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'close-tabs-by-domain') {
      const pageUrl = (tab && tab.url) || info.pageUrl;
      if (pageUrl) {
        try {
          const hostname = new URL(pageUrl).hostname;
          // Strip leading 'www.' so tabs with and without 'www.' match
          const keyword = hostname.replace(/^www\./, '');
          closeTabsByKeyword(keyword);
        } catch (e) {
          console.error('Failed to parse URL for context menu:', e);
        }
      }
    }
  });
})();
