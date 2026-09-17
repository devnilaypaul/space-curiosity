import { isFavorite, toggleFavorite } from "./store.js";

export async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}

export function observeReveals(root = document) {
  const els = root.querySelectorAll(".reveal:not(.visible)");
  if (!els.length) return;
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
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  els.forEach((el) => io.observe(el));
}

export function favButton(id) {
  const active = isFavorite(id);
  return `<button class="fav-btn" type="button" data-fav="${id}" aria-pressed="${active}" aria-label="${active ? "Remove from saved items" : "Save to saved items"}">${active ? "Saved" : "Save"}</button>`;
}

export function bindFavorites(root = document) {
  root.querySelectorAll("[data-fav]").forEach((btn) => {
    if (btn.dataset.favBound) return;
    btn.dataset.favBound = "1";
    btn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      const id = btn.getAttribute("data-fav");
      const now = toggleFavorite(id);
      document.querySelectorAll(`[data-fav="${CSS.escape(id)}"]`).forEach((b) => {
        b.setAttribute("aria-pressed", String(now));
        b.setAttribute("aria-label", now ? "Remove from saved items" : "Save to saved items");
        b.textContent = now ? "Saved" : "Save";
      });
    });
  });
}

let lastFocus = null;

export function openDialog(html) {
  let dlg = document.getElementById("detail-dialog");
  if (!dlg) {
    dlg = document.createElement("dialog");
    dlg.id = "detail-dialog";
    document.body.appendChild(dlg);
    dlg.addEventListener("click", (e) => {
      if (e.target === dlg) dlg.close();
    });
    dlg.addEventListener("close", () => {
      if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
      lastFocus = null;
    });
  }
  lastFocus = document.activeElement;
  dlg.innerHTML = `<div class="dialog-body"><div class="dialog-top"><button class="btn btn-small dialog-close" value="close" type="button">Close</button></div>${html}</div>`;
  dlg.querySelector(".dialog-close").addEventListener("click", () => dlg.close(), { once: true });
  if (!dlg.open) dlg.showModal();
  const closeBtn = dlg.querySelector(".dialog-close");
  if (closeBtn) closeBtn.focus();
}

export function imgFallback(root = document) {
  root.querySelectorAll("img").forEach((img) => {
    if (img.dataset.fbBound) return;
    img.dataset.fbBound = "1";
    img.addEventListener("error", () => img.remove(), { once: true });
  });
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

export function clearToolbar(form) {
  if (!form) return;
  form.querySelectorAll("input, select").forEach((el) => {
    el.value = "";
  });
  form.dispatchEvent(new Event("reset-filters", { bubbles: true }));
}

export function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}
