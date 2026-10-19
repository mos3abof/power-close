// The site header's menu under the md breakpoint: a disclosure
// (js/nav-menu.js), the menu shown and hidden with `hidden`.

import { wireNavMenu } from "./nav-menu.js";

/** Wire every `.al-site-header`'s `[data-site-menu-toggle]` to the menu it controls. */
export function initSiteHeaders(root = document) {
  for (const button of root.querySelectorAll(".al-site-header [data-site-menu-toggle]")) {
    if (button.dataset.alWired !== undefined) continue;
    button.dataset.alWired = "";
    const menu = document.getElementById(button.getAttribute("aria-controls"));
    if (!menu) continue;
    wireNavMenu(button, menu, (open) => { menu.hidden = !open; });
  }
}
