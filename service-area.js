(() => {
  const frame = document.querySelector("#service-map");
  const latInput = document.querySelector("#zone-lat");
  const lonInput = document.querySelector("#zone-lon");
  const radiusInput = document.querySelector("#zone-radius");
  const updateButton = document.querySelector("#save-service-zone");
  if (!frame || !latInput || !lonInput || !radiusInput || !updateButton) return;

  const defaults = { center: [50.0815, 19.899], radiusMeters: 3500, zoom: 11 };
  const config = window.BRIGHTSIDE_SERVICE_AREA || defaults;
  latInput.value = Number(config.center?.[0] ?? defaults.center[0]).toFixed(5);
  lonInput.value = Number(config.center?.[1] ?? defaults.center[1]).toFixed(5);
  radiusInput.value = Math.max(250, Number(config.radiusMeters) || defaults.radiusMeters);

  function updateMap() {
    const lat = Number(latInput.value);
    const lon = Number(lonInput.value);
    const radius = Math.max(250, Number(radiusInput.value) || defaults.radiusMeters);
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) return;
    const deltaLat = radius / 111320;
    const deltaLon = radius / (111320 * Math.cos(lat * Math.PI / 180));
    const bbox = [lon - deltaLon, lat - deltaLat, lon + deltaLon, lat + deltaLat].join("%2C");
    frame.src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`;
    window.BRIGHTSIDE_SERVICE_AREA = {
      center: [Number(lat.toFixed(5)), Number(lon.toFixed(5))],
      radiusMeters: radius,
      zoom: Number(config.zoom) || defaults.zoom
    };
    const status = document.querySelector("#map-save-status");
    status.textContent = document.documentElement.lang === "pl"
      ? "Mapa zaktualizowana. Zapisz nowe wartości w pliku service-area-config.js."
      : "Map updated. To keep the zone, edit service-area-config.js with these values.";
  }

  updateButton.addEventListener("click", updateMap);
  updateMap();
})();
