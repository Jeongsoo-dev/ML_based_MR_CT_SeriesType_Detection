(function () {
  // Only run on the History page
  const el = document.getElementById("history-map");
  if (!el) return;

  // Create map (world view)
  const map = L.map("history-map", {
    scrollWheelZoom: false,
    worldCopyJump: true
  }).setView([20, 0], 2);

  // Simple base layer (OpenStreetMap)
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  // Country → your blog page mapping
  // Use ISO_A2 or ISO_A3 depending on your GeoJSON properties.
  const countryLinks = {
    "JP": "/history/japan/",
    "DK": "/history/denmark/",
    "CN": "/history/china/",
    "KR": "/history/korea/"
  };

  // Load your GeoJSON (place it at docs/assets/countries.geojson)
  fetch("/assets/countries.geojson")
    .then(r => r.json())
    .then(geo => {
      L.geoJSON(geo, {
        style: () => ({
          weight: 1,
          fillOpacity: 0.25
        }),
        onEachFeature: (feature, layer) => {
          const iso2 = feature.properties.ISO_A2; // common field name
          const name = feature.properties.ADMIN || feature.properties.name;

          layer.bindTooltip(name, { sticky: true });

          layer.on("mouseover", () => layer.setStyle({ fillOpacity: 0.45 }));
          layer.on("mouseout", () => layer.setStyle({ fillOpacity: 0.25 }));

          layer.on("click", () => {
            const href = countryLinks[iso2];
            if (href) window.location.href = href;
            else alert(`No post yet for ${name} (${iso2}).`);
          });
        }
      }).addTo(map);
    })
    .catch(err => {
      console.error("Failed to load GeoJSON:", err);
      el.innerHTML = "<p>Map failed to load (missing GeoJSON).</p>";
    });
})();
