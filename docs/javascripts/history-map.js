(function () {
  const el = document.getElementById("history-map");
  if (!el) return;

  // ====== BASE PATH (supports local + GitHub Pages subpath) ======
  // If site is served at: https://jeongsoo-dev.github.io/ML_based_MR_CT_SeriesType_Detection/
  // then base = "/ML_based_MR_CT_SeriesType_Detection/"
  // If local: base = "/"
  const basePath = (() => {
    const segs = window.location.pathname.split("/").filter(Boolean);
    // segs[0] is "ML_based_MR_CT_SeriesType_Detection" on GitHub Pages
    // segs[0] is "" on local root
    if (segs.length > 0 && segs[0] === "ML_based_MR_CT_SeriesType_Detection") {
      return `/${segs[0]}/`;
    }
    return "/";
  })();

  const base = (p) => (p.startsWith("/") ? `${basePath}${p.slice(1)}` : `${basePath}${p}`);

  // ====== VISITED COUNTRIES (ISO_A2 codes) ======
  const visited = new Set([
    "DK", // Denmark
    "KR", // Korea
    "CN", // China
    "JP", // Japan
    // add more: "DE", "FR", "SE", ...
  ]);

  // ====== Country -> blog page mapping (ONLY add those you actually have) ======
  const countryLinks = {
    DK: base("history/denmark/"),
    KR: base("history/korea/"),
    CN: base("history/china/"),
    JP: base("history/japan/"),
  };

  // ====== Leaflet map init ======
  const map = L.map("history-map", {
    scrollWheelZoom: false,
    worldCopyJump: true,
  }).setView([20, 0], 2);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  // ====== Load GeoJSON (your file is at docs/assets/countries.geojson) ======
  fetch(new URL("../assets/countries.geojson", window.location.href))
    .then((r) => r.json())
    .then((geo) => {
      L.geoJSON(geo, {
        style: (feature) => {
          const iso2 = feature?.properties?.ISO_A2;
          const isVisited = visited.has(iso2);
          return {
            weight: isVisited ? 2 : 1,
            fillOpacity: isVisited ? 0.45 : 0.12,
          };
        },
        onEachFeature: (feature, layer) => {
          const iso2 = feature.properties.ISO_A2;
          const name = feature.properties.ADMIN || feature.properties.name || iso2;

          layer.bindTooltip(`${name}`, { sticky: true });

          layer.on("mouseover", () => {
            layer.setStyle({ fillOpacity: 0.55 });
            if (layer.getElement()) layer.getElement().style.cursor = "pointer";
          });

          layer.on("mouseout", () => {
            const isVisited = visited.has(iso2);
            layer.setStyle({ fillOpacity: isVisited ? 0.45 : 0.12 });
          });

          layer.on("click", () => {
            const href = countryLinks[iso2];
            if (href) window.location.href = href;
            else alert(`No post yet for ${name} (${iso2}).`);
          });
        },
      }).addTo(map);
    })
    .catch((err) => {
      console.error("Failed to load GeoJSON:", err);
      el.innerHTML = "<p>Map failed to load (missing countries.geojson).</p>";
    });
})();
