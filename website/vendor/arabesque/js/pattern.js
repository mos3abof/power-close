// The tessellation: Hankin's "polygons in contact" on the 4.8.8 tiling
// (regular octagons and squares). From each edge's midpoint two strands
// leave at the contact angle θ (67.5° by default); the strands leaning
// towards a vertex meet on its bisector, at (side/2)·sin θ / sin(θ + α/2)
// from it, α being the polygon's interior angle. One repeat is side·(1+√2)
// square, centred on a square, with a quarter octagon in each corner; the
// mark is the same tile centred on an octagon.

/** The strands of one repeat tile, as an SVG path, and its period. */
export function tile(side = 32, angle = 67.5) {
  const a = side * (1 + Math.SQRT2);
  const theta = (angle * Math.PI) / 180;
  const octagon = (cx, cy) => {
    const r = a / 2;
    const h = side / 2;
    return [[cx + h, cy - r], [cx + r, cy - h], [cx + r, cy + h], [cx + h, cy + r], [cx - h, cy + r], [cx - r, cy + h], [cx - r, cy - h], [cx - h, cy - r]];
  };
  const square = (cx, cy) => {
    const d = side / Math.SQRT2;
    return [[cx, cy - d], [cx + d, cy], [cx, cy + d], [cx - d, cy]];
  };
  const polygons = [octagon(0, 0), octagon(a, 0), octagon(0, a), octagon(a, a), square(a / 2, a / 2)];
  const r = (n) => Math.round(n * 100) / 100;
  let d = "";
  for (const p of polygons) {
    const n = p.length;
    const interior = ((n - 2) * Math.PI) / n;
    const cx = p.reduce((s, v) => s + v[0], 0) / n;
    const cy = p.reduce((s, v) => s + v[1], 0) / n;
    const reach = ((side / 2) * Math.sin(theta)) / Math.sin(theta + interior / 2);
    // Where a vertex's two strands meet: on its bisector, towards the centre.
    const meet = ([x, y]) => {
      const len = Math.hypot(cx - x, cy - y);
      return [x + ((cx - x) / len) * reach, y + ((cy - y) / len) * reach];
    };
    for (let i = 0; i < n; i++) {
      const v = p[i];
      const w = p[(i + 1) % n];
      const m = [(v[0] + w[0]) / 2, (v[1] + w[1]) / 2];
      const [p1, p2] = [meet(v), meet(w)];
      d += `M${r(p1[0])} ${r(p1[1])}L${r(m[0])} ${r(m[1])}L${r(p2[0])} ${r(p2[1])}`;
    }
  }
  return { d, period: a };
}

let count = 0;
/**
 * Fill an element with the pattern (it's decoration: aria-hidden). The
 * geometry comes from the tokens (--al-pattern-side, -side-narrow under the
 * md breakpoint, -stroke, -contact-angle), unless it's given here.
 */
export function drawPattern(el, { side, angle, stroke } = {}) {
  const style = getComputedStyle(el);
  const token = (name, fallback) => parseFloat(style.getPropertyValue(`--al-pattern-${name}`)) || fallback;
  const narrow = matchMedia("(max-width: 52rem)").matches;
  const s = side ?? (narrow ? token("side-narrow", 22) : token("side", 32));
  angle ??= token("contact-angle", 67.5);
  stroke ??= token("stroke", 1.25);
  const { d, period } = tile(s, angle);
  const id = `al-pattern-${++count}`;
  el.setAttribute("aria-hidden", "true");
  el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" focusable="false"><defs><pattern id="${id}" width="${period}" height="${period}" patternUnits="userSpaceOnUse"><path d="${d}" fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linejoin="miter" stroke-linecap="square"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`;
}

// ---- the hero ------------------------------------------------------------------------------
//
// The tessellation across a hero, as on arabesquelabs.com: one quiet line
// everywhere, with one octagon, the focal tile, in the accent. On first load
// it can draw itself in, the way it's constructed: the polygons appear as
// faint scaffolding, the strands draw outwards from the focal tile, then the
// scaffolding fades and the focal tile and its caption appear.

const SVG = "http://www.w3.org/2000/svg";
const f2 = (n) => n.toFixed(2);
const toPath = (pts) => `M${pts.map((p) => `${f2(p[0])} ${f2(p[1])}`).join("L")}Z`;
const regular = (n, cx, cy, r, rot) => Array.from({ length: n }, (_, k) => {
  const a = rot + (2 * Math.PI * k) / n;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
});

/** The star a polygon makes at the contact angle: midpoint, meeting point, midpoint… */
function star(v, angle) {
  const theta = (angle * Math.PI) / 180;
  const n = v.length;
  const cx = v.reduce((s, p) => s + p[0], 0) / n;
  const cy = v.reduce((s, p) => s + p[1], 0) / n;
  const interior = ((n - 2) * Math.PI) / n;
  const half = Math.hypot(v[1][0] - v[0][0], v[1][1] - v[0][1]) / 2;
  const reach = (half * Math.sin(theta)) / Math.sin(theta + interior / 2);
  const mid = v.map((p, k) => { const q = v[(k + 1) % n]; return [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]; });
  const meet = v.map(([x, y]) => { const len = Math.hypot(cx - x, cy - y); return [x + ((cx - x) / len) * reach, y + ((cy - y) / len) * reach]; });
  const pts = [mid[n - 1]];
  for (let k = 0; k < n; k++) pts.push(meet[k], mid[k]);
  return pts;
}

/**
 * Every cell of the tiling over a w × h area, with an octagon centred on
 * (ox, oy): its kind, centre, polygon and star, as SVG paths.
 */
export function cells(side, angle, ox, oy, w, h) {
  const period = side * (1 + Math.SQRT2);
  const r8 = side / (2 * Math.sin(Math.PI / 8));
  const r4 = side / Math.SQRT2;
  const out = [];
  const i0 = Math.floor(-ox / period) - 1, i1 = Math.ceil((w - ox) / period) + 1;
  const j0 = Math.floor(-oy / period) - 1, j1 = Math.ceil((h - oy) / period) + 1;
  for (let i = i0; i <= i1; i++) {
    for (let j = j0; j <= j1; j++) {
      const o = [ox + i * period, oy + j * period];
      const q = [o[0] + period / 2, o[1] + period / 2];
      for (const [kind, c, v] of [["octagon", o, regular(8, o[0], o[1], r8, Math.PI / 8)], ["square", q, regular(4, q[0], q[1], r4, 0)]]) {
        out.push({ key: `${kind[0]}:${i}:${j}`, kind, cx: c[0], cy: c[1], polygon: toPath(v), star: toPath(star(v, angle)) });
      }
    }
  }
  return { cells: out, period };
}

const node = (tag, attrs = {}) => {
  const e = document.createElementNS(SVG, tag);
  for (const [k, v] of Object.entries(attrs)) if (v != null) e.setAttribute(k, v);
  return e;
};
const heroes = new WeakMap();

/**
 * Draw the hero pattern into a `.al-pattern--hero` section's art
 * (aria-hidden). The focal tile sits about three quarters across and half
 * way down on wide screens, mirrored in right to left. Under the md
 * breakpoint, where the text takes the whole width, there's no focal tile and
 * the caption is hidden. A `[data-pattern-caption]` in the section is placed
 * under the focal tile. Redraws when the width changes or when called again after `dir`
 * changes. `animate` draws it in once, never under reduced motion.
 */
export function drawHero(el, { side, angle, focal = true, animate = false } = {}) {
  const style = getComputedStyle(el);
  const token = (name, fallback) => parseFloat(style.getPropertyValue(`--al-pattern-${name}`)) || fallback;
  const box = el.getBoundingClientRect();
  const w = Math.round(box.width), h = Math.round(box.height);
  if (!w || !h) return;
  const narrow = matchMedia("(max-width: 52rem)").matches;
  const rtl = style.direction === "rtl";
  const s = side ?? (narrow ? token("hero-side-narrow", 30) : token("hero-side", 46));
  angle ??= token("contact-angle", 67.5);
  // The height can shift a little as the page settles (fonts, a language switch): the drawing covers a
  // quarter more than it needs, and is redrawn only when the width, direction or geometry change, or the
  // section outgrows it. So a draw-in in progress isn't cut short.
  const key = JSON.stringify([w, rtl, narrow, s, angle, focal]);
  const state = heroes.get(el) ?? {};
  if (state.key === key && h <= state.height) return;
  const cover = Math.round(h * 1.25);

  const period = s * (1 + Math.SQRT2);
  const showFocal = focal && !narrow;
  const fx = narrow ? w / 2 : rtl ? w * 0.24 : w * 0.76;
  const fy = narrow ? period : h * 0.5;
  const { cells: all } = cells(s, angle, fx, fy, w, cover);
  let far = 1, focalCell = null, best = Infinity;
  for (const c of all) {
    c.dist = Math.hypot(c.cx - fx, c.cy - fy);
    far = Math.max(far, c.dist);
    if (c.kind === "octagon" && c.dist < best) { best = c.dist; focalCell = c; }
  }
  const drawing = animate && !state.drawn && !matchMedia("(prefers-reduced-motion: reduce)").matches;

  const svg = node("svg", { width: w, height: cover, viewBox: `0 0 ${w} ${cover}`, focusable: "false" });
  const scaffold = node("g", { class: "al-pattern__scaffold" });
  const strands = node("g", { class: "al-pattern__strands" });
  for (const c of all) {
    scaffold.append(node("path", { d: c.polygon }));
    strands.append(node("path", { d: c.star, pathLength: 1, style: drawing ? `animation-delay:${Math.round((900 * c.dist) / far)}ms` : null }));
  }
  svg.append(scaffold, strands);
  if (showFocal && focalCell) {
    const g = node("g", { class: "al-pattern__focal" });
    g.append(node("path", { d: focalCell.polygon, class: "al-pattern__focal-tile" }), node("path", { d: focalCell.star, class: "al-pattern__focal-star" }));
    svg.append(g);
  }
  el.setAttribute("aria-hidden", "true");
  el.replaceChildren(svg);

  const section = el.closest(".al-pattern");
  section?.classList.toggle("is-drawing", drawing);
  const caption = section?.querySelector("[data-pattern-caption]");
  if (caption) {
    const r = section.getBoundingClientRect();
    const placed = showFocal;
    caption.hidden = !placed;
    caption.classList.toggle("is-placed", placed);
    // Placed under the focal tile, its rule starting at the tile's centre and running towards the trailing side.
    caption.style.insetBlockStart = placed ? `${box.top - r.top + fy + period * 0.5 + 12}px` : "";
    caption.style.insetInlineStart = placed ? `${rtl ? r.right - (box.left + fx) : box.left - r.left + fx}px` : "";
  }

  state.drawn = true;
  state.key = key;
  state.options = { side, angle, focal, animate };
  state.width = w;
  state.height = cover;
  if (drawing) setTimeout(() => section?.classList.remove("is-drawing"), 2700);
  if (!state.observer && typeof ResizeObserver === "function") {
    let timer;
    state.observer = new ResizeObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const current = heroes.get(el);
        if (Math.round(el.getBoundingClientRect().width) !== current.width) drawHero(el, current.options);
      }, 120);
    });
    state.observer.observe(el);
  }
  heroes.set(el, state);
}

// ---- the construction figure ---------------------------------------------------------------

/**
 * One step of the construction, as an SVG in `el` (a 200 × 200 frame, side
 * 32): 1 the tiling, 2 the tiling with the strands at the angle, 3 the
 * strands alone.
 */
export function drawConstruction(el, step, { angle = 67.5, side = 32 } = {}) {
  const { cells: all } = cells(side, angle, 100, 100, 200, 200);
  const svg = node("svg", { viewBox: "0 0 200 200", class: "al-construction__svg", "aria-hidden": "true", focusable: "false" });
  const layer = (cls, key) => { const g = node("g", { class: cls }); g.append(...all.map((c) => node("path", { d: c[key] }))); svg.append(g); };
  if (step < 3) layer("al-construction__scaffold", "polygon");
  if (step === 2) layer("al-construction__rays", "star");
  if (step === 3) layer("al-construction__strands", "star");
  el.replaceChildren(svg);
}

/**
 * Wire every `[data-construction]` figure: draw its three
 * `[data-construction-step]` panels, and, if it has a
 * `[data-construction-angle]` range input, redraw steps 2 and 3 when it
 * moves, showing the angle in its `[data-construction-value]` output.
 */
export function initConstruction(root = document) {
  for (const fig of root.querySelectorAll("[data-construction]")) {
    const input = fig.querySelector("[data-construction-angle]");
    const output = fig.querySelector("[data-construction-value]");
    const draw = (onlyLive) => {
      const angle = input ? Number(input.value) : 67.5;
      for (const el of fig.querySelectorAll("[data-construction-step]")) {
        const step = Number(el.dataset.constructionStep);
        if (!onlyLive || step > 1) drawConstruction(el, step, { angle: step === 1 ? 67.5 : angle });
      }
      if (output) output.value = `${angle.toFixed(1)}°`;
      if (input) input.setAttribute("aria-valuetext", `${angle.toFixed(1)}°`);
    };
    draw();
    if (input && !input.dataset.alWired) {
      input.dataset.alWired = "";
      input.addEventListener("input", () => draw(true));
    }
  }
}
