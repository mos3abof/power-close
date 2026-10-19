# Arabesque Labs design system, vendored

From the design system at **0.5.1** (https://design.arabesquelabs.com/,
`v/0.5.1/`, source: https://github.com/ArabesqueLabs/design-system), copied
unchanged, so the site serves its own CSS, fonts and scripts and sends no
visitor to a third party. Don't edit these: to update, copy the new
version's files over them and change the version here.

| File | From |
|---|---|
| `dist/arabesque.css` | `dist/arabesque.css`: tokens, base, layout, components, utilities, in cascade layers |
| `dist/icons.svg` | `dist/icons.svg`: the icon sprite (the header's menu and close) |
| `js/pattern.js` | `js/pattern.js`: the texture behind the hero and the call to action |
| `js/site-header.js`, `js/nav-menu.js` | `js/`: the header's menu, under the md width |
| `fonts/fonts.css` | `fonts/fonts.css`, trimmed to the Jost, Newsreader and IBM Plex Mono faces |
| `fonts/*.woff2`, `fonts/OFL-*.txt` | `fonts/`: those faces, and their licences (SIL OFL 1.1) |

The site is in English, so the Arabic faces, Amiri and Kufam aren't shipped.

The site's own rules are in `../../site.css`. They're unlayered, so they win
over the system's layers without `!important`.
