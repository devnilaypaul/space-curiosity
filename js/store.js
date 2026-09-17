const KEY = "space-curiosity:favorites:v1";

export function getFavorites() {
  try {
    return new Set(JSON.parse(localStorage.getItem(KEY) ?? "[]"));
  } catch {
    return new Set();
  }
}

export function isFavorite(id) {
  return getFavorites().has(id);
}

export function toggleFavorite(id) {
  const favs = getFavorites();
  if (favs.has(id)) favs.delete(id);
  else favs.add(id);
  localStorage.setItem(KEY, JSON.stringify([...favs]));
  const now = favs.has(id);
  document.dispatchEvent(new CustomEvent("favorites-changed", { detail: { id, saved: now } }));
  return now;
}

export function clearFavorites() {
  localStorage.setItem(KEY, JSON.stringify([]));
  document.dispatchEvent(new CustomEvent("favorites-changed", { detail: { cleared: true } }));
}
