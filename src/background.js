function closeTabsByKeyword(keyword) {
    if (!keyword) {
        return;
    }

    chrome.tabs.query({}, function (tabs) {
        for (var i = 0; i < tabs.length; i++) {
            var tab = tabs[i];
            if (tab.url.indexOf(keyword) > -1) {
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
        var keyword = new URL(event.pageUrl).hostname;
        closeTabsByKeyword(keyword);
    }
});