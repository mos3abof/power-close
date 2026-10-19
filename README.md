# Power Close

A browser extension, for the tab addict, that closes every tab whose address
contains a keyword or a domain name. Many Facebook tabs open, scattered across
windows? Type `facebook.com`, press Enter, and they're all closed.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="website/screenshots/demo-dark.gif">
  <img src="website/screenshots/demo-light.gif" alt="The Power Close popup in use: github.com is typed in, “Closes 4 of 12 open tabs.” appears above the Close 4 tabs button, and Enter closes them: “Closed 4 tabs.”" width="320">
</picture>

## Install

- [Chrome Web Store](https://chrome.google.com/webstore/detail/power-close/jjpmcpmmajigbkjchbkoclipomlmpaaj)
- [Firefox Add-ons](https://addons.mozilla.org/firefox/addon/firefox-power-close/)

It runs on Chrome (Manifest V3), Firefox 140 and later, and Firefox for Android
142 and later.

## Usage

Press the Power Close button in the toolbar and type a keyword or domain name.
As you type, the popup counts the tabs that match, so you can see what will
close before anything does. Press <kbd>Enter</kbd>, or the button that names
the count, to close them; <kbd>Esc</kbd> closes the popup and leaves your tabs
alone.

You can also right-click a page and choose **Close all tabs from this domain**.

### What matches

- **The popup** matches what you type anywhere in a tab's full address,
ignoring case, across every window, pinned tabs included. So `github.com` also
closes `gist.github.com`, and a search results page whose address contains
"github.com".

- **The right-click option** matches the page's hostname, without its leading
`www.`, in the same way, so it closes the site's subdomains too.

Closed too many? Your browser's Reopen Closed Tab
(<kbd>Ctrl</kbd>/<kbd>⌘</kbd>+<kbd>Shift</kbd>+<kbd>T</kbd>) brings them back.

## Privacy

Power Close reads your tabs' addresses to match and close them, and nothing
else. It has NO network code, collects NO data, and needs NO account.

## Development

You'll need `make` and `zip`.

```
make            # build both: dist/chrome/ and dist/firefox/
make chrome     # build Chrome only
make firefox    # build Firefox only
make validate   # check the manifests are valid JSON
```

Each folder in `dist/` holds the unpacked extension and a `power-close.zip` of
it for the stores.

To try a build:

- **Chrome:** open `chrome://extensions`, turn on Developer mode, choose **Load
unpacked** and pick `dist/chrome/`.

- **Firefox:** open `about:debugging#/runtime/this-firefox`, choose **Load
Temporary Add-on…** and pick `dist/firefox/manifest.json`.

The source is in `src/`. The two browsers share everything except their
manifests (`src/manifest-chrome.json` and `src/manifest-firefox.json`), so
change both when you change one.

`make screenshots` retakes the screenshots and the GIF above (it needs Node
22+, Chrome and ffmpeg).

## Design

The popup is built on the [Arabesque Labs design
system](https://design.arabesquelabs.com/), vendored into
`src/vendor/arabesque/`.

## Credits

- [Mosab Ibrahim](https://mosab.co.uk) wrote Power Close for Firefox in 2014
- [Mina Asham](https://github.com/mina-asham) ported it to Chrome
- and it's now maintained by [Mosab Ibrahim](https://mosab.co.uk) at [Arabesque Labs](https://arabesquelabs.com/)

Bug reports and contributions are welcome in [the
issues](https://github.com/ArabesqueLabs/power-close/issues).

## License

Copyright © 2014–2026 Mosab Ibrahim. Free software under the GNU General Public
License, version 2 or (at your option) any later version: see
[LICENSE](LICENSE).
