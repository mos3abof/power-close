'use strict';

const DEFAULT_PREFS = {
  excludeCurrentTab: true,
  excludePinnedTabs: true,
  excludeExtensionPages: true,
  caseSensitive: false,
};

const INTERNAL_SCHEMES = [
  'chrome://',
  'about:',
  'edge://',
  'opera://',
  'vivaldi://',
  'brave://',
];

function isInternalUrl(url) {
  if (!url) return true;
  return INTERNAL_SCHEMES.some(scheme => url.startsWith(scheme));
}

function isExtensionUrl(url) {
  return url.startsWith('chrome-extension://') || url.startsWith('moz-extension://');
}

async function getPrefs() {
  return chrome.storage.sync.get(DEFAULT_PREFS);
}

async function closeTabsByKeyword(keyword, sourceTabId) {
  if (!keyword) return;

  const prefs = await getPrefs();
  const needle = prefs.caseSensitive ? keyword : keyword.toLowerCase();
  const tabs = await chrome.tabs.query({});
  const toClose = [];

  for (const tab of tabs) {
    if (isInternalUrl(tab.url)) continue;
    if (prefs.excludeExtensionPages && isExtensionUrl(tab.url)) continue;
    if (prefs.excludePinnedTabs && tab.pinned) continue;
    if (prefs.excludeCurrentTab && tab.id === sourceTabId) continue;

    const haystack = prefs.caseSensitive ? tab.url : tab.url.toLowerCase();
    if (haystack.includes(needle)) {
      toClose.push(tab.id);
    }
  }

  if (toClose.length > 0) {
    chrome.tabs.remove(toClose);
  }
}

async function closeDuplicateTabs(sourceTabId) {
  const prefs = await getPrefs();
  const tabs = await chrome.tabs.query({});
  const seen = new Set();
  const toClose = [];

  for (const tab of tabs) {
    if (isInternalUrl(tab.url)) continue;
    if (prefs.excludePinnedTabs && tab.pinned) continue;
    if (prefs.excludeCurrentTab && tab.id === sourceTabId) continue;

    if (seen.has(tab.url)) {
      toClose.push(tab.id);
    } else {
      seen.add(tab.url);
    }
  }

  if (toClose.length > 0) {
    chrome.tabs.remove(toClose);
  }
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'close-domain',
    title: 'Close all tabs from this domain',
    contexts: ['page', 'image', 'link', 'frame'],
  });
  chrome.contextMenus.create({
    id: 'close-duplicates',
    title: 'Close duplicate tabs',
    contexts: ['page', 'image', 'link', 'frame'],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'close-domain') {
    const keyword = new URL(info.pageUrl).hostname;
    closeTabsByKeyword(keyword, tab?.id);
  } else if (info.menuItemId === 'close-duplicates') {
    closeDuplicateTabs(tab?.id);
  }
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.event !== 'text-entered') return;
  chrome.tabs.query({ active: true, currentWindow: true }, (activeTabs) => {
    closeTabsByKeyword(message.text, activeTabs[0]?.id);
  });
});
