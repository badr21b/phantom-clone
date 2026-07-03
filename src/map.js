// Algeria bounds for map projection (approximate).
export const ALG_BOUNDS = {
  minLat: 18.9,
  maxLat: 37.2,
  minLng: -8.8,
  maxLng: 12.0,
};

// Simplified Algeria silhouette (viewBox 0 0 240 160).
export const ALGERIA_PATH =
  "M 38 18 L 72 10 L 118 8 L 158 14 L 192 22 L 218 38 L 228 58 L 224 82 L 210 102 L 188 118 L 162 128 L 132 134 L 102 136 L 72 132 L 48 122 L 30 104 L 18 82 L 12 58 L 14 36 L 24 24 Z";

export function projectLatLng(lat, lng, vbW = 240, vbH = 160, pad = 14) {
  const { minLat, maxLat, minLng, maxLng } = ALG_BOUNDS;
  const x = pad + ((lng - minLng) / (maxLng - minLng)) * (vbW - pad * 2);
  const y = pad + ((maxLat - lat) / (maxLat - minLat)) * (vbH - pad * 2);
  return { x, y };
}

export function formatCoords(lat, lng) {
  const latDir = lat >= 0 ? "N" : "S";
  const lngDir = lng >= 0 ? "E" : "W";
  const latD = Math.floor(Math.abs(lat));
  const latM = Math.round((Math.abs(lat) - latD) * 60);
  const lngD = Math.floor(Math.abs(lng));
  const lngM = Math.round((Math.abs(lng) - lngD) * 60);
  return `${latD}°${String(latM).padStart(2, "0")}′${latDir} · ${lngD}°${String(lngM).padStart(2, "0")}′${lngDir}`;
}

export function osmEmbedUrl(lat, lng, delta = 0.35) {
  const bbox = `${lng - delta},${lat - delta * 0.7},${lng + delta},${lat + delta * 0.7}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
}

export function renderCityMap(container, city) {
  const { x, y } = projectLatLng(city.lat, city.lng);

  container.innerHTML = `
    <div class="map-panel">
      <p class="map-label mono">LOCATION IN ALGERIA</p>
      <svg class="map-algeria" viewBox="0 0 240 160" aria-hidden="true">
        <path class="map-country" d="${ALGERIA_PATH}" />
        <circle class="map-pulse" cx="${x}" cy="${y}" r="10" />
        <circle class="map-dot" cx="${x}" cy="${y}" r="5" />
      </svg>
      <p class="map-coords mono">${city.coords}</p>
      <p class="map-region-label">${city.region} · ${city.wilaya ?? city.city}</p>
      <iframe
        class="map-osm"
        title="Map of ${city.city}"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        src="${osmEmbedUrl(city.lat, city.lng)}"
      ></iframe>
    </div>
  `;
}
