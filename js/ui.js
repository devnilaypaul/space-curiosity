import { isFavorite, toggleFavorite } from "./store.js";

export async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}

export function observeReveals(root = document) {
  const els = root.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        io.unobserve(e.target);
      }
    }),
    { threshold: 0.12 }
  );
  els.forEach((el) => io.observe(el));
}

export function favButton(id) {
  const active = isFavorite(id);
  return `<button class="fav-btn" data-fav="${id}" aria-pressed="${active}" aria-label="Save to favorites">${active ? "Saved" : "Save"}</button>`;
}

export function bindFavorites(root = document) {
  root.querySelectorAll("[data-fav]").forEach((btn) => {
    btn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      const id = btn.getAttribute("data-fav");
      const now = toggleFavorite(id);
      btn.setAttribute("aria-pressed", String(now));
      btn.textContent = now ? "Saved" : "Save";
    });
  });
}

export function openDialog(html) {
  let dlg = document.getElementById("detail-dialog");
  if (!dlg) {
    dlg = document.createElement("dialog");
    dlg.id = "detail-dialog";
    document.body.appendChild(dlg);
  }
  dlg.innerHTML = `<div class="dialog-body"><button class="btn btn-small dialog-close" value="close">Close</button>${html}</div>`;
  dlg.querySelector(".dialog-close").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => {
    if (e.target === dlg) dlg.close();
  });
  dlg.showModal();
}

export function syncFiltersToURL(params) {
  const url = new URL(location.href);
  for (const [k, v] of Object.entries(params)) {
    if (v) url.searchParams.set(k, v);
    else url.searchParams.delete(k);
  }
  history.replaceState(null, "", url);
}

export function readFiltersFromURL(keys) {
  const url = new URL(location.href);
  const out = {};
  for (const k of keys) out[k] = url.searchParams.get(k) ?? "";
  return out;
}

export function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}
