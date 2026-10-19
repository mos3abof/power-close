// A navigation menu that folds under the md breakpoint, behind a menu
// button: a disclosure. The button says whether it's open (aria-expanded);
// Escape closes it and returns focus to the button; choosing a link closes
// it. The site header and the sidebar both use it.

/**
 * Wire `button` to open and close `menu`. `show(open)` does whatever showing
 * it takes beyond the button's aria-expanded (which CSS may be reading).
 */
export function wireNavMenu(button, menu, show = () => {}) {
  const isOpen = () => button.getAttribute("aria-expanded") === "true";
  const set = (open) => {
    show(open);
    button.setAttribute("aria-expanded", String(open));
  };
  set(false);
  button.addEventListener("click", () => set(!isOpen()));
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) set(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) { set(false); button.focus(); }
  });
}
