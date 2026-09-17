const CACHE_KEY = "space-curiosity:upcoming-cache:v1";

export async function getUpcomingLaunches(fallbackPath = "data/upcoming-fallback.json") {
  const fallback = await fetch(fallbackPath).then((r) => r.json()).catch(() => ({ launches: [] }));

  const endpoints = [
    "https://api.spacexdata.com/v5/launches/upcoming",
    "https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=12&mode=list"
  ];

  for (const url of endpoints) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 8000);
      const res = await fetch(url, { signal: ctrl.signal });
      clearTimeout(timer);
      if (!res.ok) continue;
      const raw = await res.json();
      const launches = normalize(url, raw);
      if (launches.length) {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), launches }));
        return { launches, source: "live", url };
      }
    } catch {
      continue;
    }
  }

  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) ?? "null");
    if (cached?.launches?.length) return { launches: cached.launches, source: "cache", at: cached.at };
  } catch {
    /* ignore */
  }

  return { launches: fallback.launches ?? [], source: "fallback" };
}

function normalize(url, raw) {
  if (url.includes("spacexdata")) {
    return raw.slice(0, 12).map((l) => ({
      id: `spacex-${l.id}`,
      name: l.name ?? "SpaceX mission",
      date: l.date_utc ?? null,
      provider: "SpaceX",
      vehicle: "Falcon 9 / Starship",
      pad: l.launchpad ?? "Unknown pad",
      details: "Live data from SpaceX API.",
      image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=800&q=60&auto=format&fit=crop"
    }));
  }
  const list = raw.results ?? raw.launches ?? [];
  return list.slice(0, 12).map((l) => {
    const name = l.name ?? "Upcoming launch";
    const vehicle = l.rocket?.configuration?.name
      ?? l.launcher?.full_name ?? l.launcher?.name
      ?? (name.includes("|") ? name.split("|")[0].trim() : null)
      ?? "Unknown vehicle";
    const padName = typeof l.pad === "string" ? l.pad : l.pad?.name;
    const padLoc = l.location ?? l.pad?.location?.name;
    const missionText = typeof l.mission === "string" ? l.mission : l.mission?.description;
    return {
      id: `ll2-${l.id ?? l.name}`,
      name,
      date: l.net ?? l.window_start ?? null,
      provider: l.launch_service_provider?.name ?? l.lsp_name ?? "Unknown provider",
      vehicle,
      pad: [padName, padLoc].filter(Boolean).join(", ") || "Unknown pad",
      details: missionText ?? "Live data from Launch Library 2.",
      image: l.image ?? "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=60&auto=format&fit=crop"
    };
  });
}
