'use strict';

const DEFAULT_PREFS = {
  excludeCurrentTab: true,
  excludePinnedTabs: true,
  excludeExtensionPages: true,
  caseSensitive: false,
};

const fields = Object.keys(DEFAULT_PREFS);

async function loadPrefs() {
  const prefs = await chrome.storage.sync.get(DEFAULT_PREFS);
  for (const key of fields) {
    document.getElementById(key).checked = prefs[key];
  }
}

document.getElementById('options-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const prefs = {};
  for (const key of fields) {
    prefs[key] = document.getElementById(key).checked;
  }
  await chrome.storage.sync.set(prefs);

  const status = document.getElementById('status');
  status.textContent = 'Saved.';
  setTimeout(() => { status.textContent = ''; }, 1500);
});

loadPrefs();
