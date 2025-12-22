(function () {
  const el = document.getElementById("denmark-map");
  if (!el) return;

  // base path helper (same logic as history-map.js)
  const basePath = (() => {
    const segs = window.location.pathname.split("/").filter(Boolean);
    if (segs.length > 0 && segs[0] === "ML_based_MR_CT_SeriesType_Detection") {
      return `/${segs[0]}/`;
    }
    return "/";
  })();
  const base = (p) => (p.startsWith("/") ? `${basePath}${p.slice(1)}` : `${basePath}${p}`);

  const map = L.map("denmark-map", {
    scrollWheelZoom: false,
    worldCopyJump: true,
  }).setView([56.2, 10.0], 6);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  const places = [
    { name: "Copenhagen", lat: 55.6761, lon: 12.5683, href: base("history/denmark/posts/copenhagen/") },
    { name: "Odense",     lat: 55.4038, lon: 10.4024, href: base("history/denmark/posts/odense/") },
    { name: "Aarhus",     lat: 56.1629, lon: 10.2039, href: base("history/denmark/posts/aarhus/") },
    { name: "Samsø",      lat: 55.8660, lon: 10.6050, href: base("history/denmark/posts/samso/") },
    { name: "Skagen",     lat: 57.7200, lon: 10.5830, href: base("history/denmark/posts/skagen/") },
  ];

  for (const p of places) {
    const m = L.marker([p.lat, p.lon]).addTo(map);
    m.bindTooltip(p.name, { sticky: true });
    m.on("click", () => (window.location.href = p.href));
  }
})();
