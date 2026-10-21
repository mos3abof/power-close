// Renders the social card, social/card.html, to website/img/social/card-en.png
// and card-ar.png (1200x630), with headless Chrome. Run from the repository:
//
//   node social/render.mjs        (or `make social`)
//
// Needs Node 22+ (for its WebSocket) and Chrome or Chromium (CHROME= to say
// where). No packages.
import { spawn, spawnSync } from "node:child_process";
import { createServer } from "node:http";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { extname, join, normalize } from "node:path";

const OUT = "website/img/social";
const PORT = 9351;
const TYPES = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function chrome() {
  if (process.env.CHROME) return process.env.CHROME;
  const mac = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  if (existsSync(mac)) return mac;
  for (const name of ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser"]) {
    if (spawnSync("which", [name]).status === 0) return name;
  }
  throw new Error("no Chrome or Chromium found: set CHROME to one");
}

// The page's modules and fonts need http, not file:. It's served from the
// repository's root, as the card reaches into website/ for the site's files.
const server = createServer((req, res) => {
  try {
    const path = normalize(join(".", decodeURIComponent(new URL(req.url, "http://x").pathname)));
    const body = readFileSync(path);
    res.writeHead(200, { "content-type": TYPES[extname(path)] || "application/octet-stream" }).end(body);
  } catch { res.writeHead(404).end(); }
}).listen(0, "127.0.0.1");
await new Promise((r) => server.once("listening", r));
const site = `http://127.0.0.1:${server.address().port}`;

const profile = mkdtempSync(join(tmpdir(), "power-close-card-"));
const browser = spawn(chrome(), ["--headless=new", "--disable-gpu", "--hide-scrollbars", `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${profile}`, "about:blank"], { stdio: "ignore" });
let page;
while (!page) { await sleep(200); try { page = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()).find((t) => t.type === "page"); } catch { /* starting */ } }
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r));
let id = 0; const waiting = new Map();
ws.addEventListener("message", (e) => { const m = JSON.parse(e.data); waiting.get(m.id)?.(m.result); waiting.delete(m.id); });
const send = (method, params = {}) => new Promise((r) => { const i = ++id; waiting.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });

mkdirSync(OUT, { recursive: true });
await send("Emulation.setDeviceMetricsOverride", { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false });
for (const lang of ["en", "ar"]) {
  await send("Page.navigate", { url: `${site}/social/card.html?lang=${lang}` });
  for (let ready = false; !ready; await sleep(200)) {
    ready = (await send("Runtime.evaluate", { expression: "'ready' in document.body.dataset", returnByValue: true })).result.value;
  }
  await sleep(300);
  const { data } = await send("Page.captureScreenshot", { format: "png" });
  writeFileSync(`${OUT}/card-${lang}.png`, Buffer.from(data, "base64"));
  console.log(`${OUT}/card-${lang}.png`);
}
const exited = new Promise((r) => browser.once("exit", r));
browser.kill();
await exited;
server.close();
rmSync(profile, { recursive: true, force: true, maxRetries: 5 });
process.exit(0);
