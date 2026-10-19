# Arabesque Labs design system (vendored)

The popup is built on the Arabesque Labs design system. An extension page
can't load CSS or fonts from a remote origin under its content security
policy, so the built files are copied in here rather than linked.

| File | From |
|---|---|
| `arabesque.css` | `dist/arabesque.css` — tokens, base, layout, components, utilities, in cascade layers |
| `fonts/fonts.css` | `fonts/fonts.css`, trimmed to the faces the popup uses |
| `fonts/jost-*.woff2` | `fonts/` — interface text and headings (`--al-font-sans`, `--al-font-display`) |
| `fonts/ibm-plex-mono-*.woff2` | `fonts/` — keyboard keys (`--al-font-mono`) |

Source: <https://github.com/ArabesqueLabs/design-system>, v0.4.0 (`90c7354`).

The Arabic, Newsreader and Amiri faces aren't shipped: the popup's text is
English only. Add them from the design system's `fonts/` if it's ever
translated — `fonts.css` is a subset of the system's own, so the faces can
be pasted back in unchanged.

Don't edit these files. To upgrade, check out the design system at the tag
you want and re-copy:

```sh
cp dist/arabesque.css                   <here>/arabesque.css
cp fonts/jost-latin{,-ext}.woff2        <here>/fonts/
cp fonts/ibm-plex-mono-latin{,-ext}.woff2 <here>/fonts/
```

then re-trim `fonts/fonts.css` to those four faces and check the popup in
light and dark mode.

The popup's own rules live in `../../popup/popup.css`. They're unlayered, so
they win over the system's layers without `!important`; keep them to layout
and to the few things the system has no component for.

## Fonts

Jost and IBM Plex Mono are licensed under the SIL Open Font License 1.1:
`fonts/OFL-jost.txt` and `fonts/OFL-ibmplexmono.txt`.
