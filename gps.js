// FuelTrack — GPS-rit logica (pure functies, testbaar)

const AARDE_STRAAL_M = 6371000;

/** Afstand in meters tussen twee punten (Haversine). */
function afstandMeters(lat1, lon1, lat2, lon2) {
  for (const v of [lat1, lon1, lat2, lon2]) {
    if (typeof v !== 'number' || !isFinite(v) || Math.abs(v) > 90 + 90 && Math.abs(v) > 180) return null;
  }
  if (Math.abs(lat1) > 90 || Math.abs(lat2) > 90 || Math.abs(lon1) > 180 || Math.abs(lon2) > 180) return null;
  const rad = d => d * Math.PI / 180;
  const dLat = rad(lat2 - lat1);
  const dLon = rad(lon2 - lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(rad(lat1))*Math.cos(rad(lat2))*Math.sin(dLon/2)**2;
  return 2 * AARDE_STRAAL_M * Math.asin(Math.sqrt(a));
}

/**
 * Totale ritlengte in meters over een reeks punten [{lat, lon, t}].
 - Slaat punten zonder geldige coördinaten over.
 - Negeert sprongen: één stap mag max. jumpMaxM meters en niet-teruglopende tijd zijn.
 - Punten dichter dan minStepM bij het vorige punt tellen niet mee (staan stil).
 */
function ritLengte(punten, { jumpMaxM = 2000, minStepM = 5 } = {}) {
  if (!Array.isArray(punten)) return null;
  let totaal = 0;
  let vorige = null;
  for (const p of punten) {
    if (!p || typeof p.lat !== 'number' || typeof p.lon !== 'number') continue;
    if (Math.abs(p.lat) > 90 || Math.abs(p.lon) > 180) continue;
    if (vorige) {
      const d = afstandMeters(vorige.lat, vorige.lon, p.lat, p.lon);
      if (d === null) continue;
      // GPS-sprong (tunnel, storing): te ver in één stap -> negeer dit punt
      if (d > jumpMaxM) continue;
      if (d < minStepM) continue; // staan stil
      totaal += d;
    }
    vorige = p;
  }
  return Math.round(totaal);
}

/** Meters netjes tonen: "12,4 km" of "850 m". */
function formatKm(meters) {
  if (typeof meters !== 'number' || !isFinite(meters)) return '—';
  if (meters < 1000) return Math.round(meters) + ' m';
  return String(Math.round(meters/100)/10).replace('.', ',') + ' km';
}

if (typeof module !== 'undefined') {
  module.exports = { afstandMeters, ritLengte, formatKm };
}
