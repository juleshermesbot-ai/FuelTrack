// FuelTrack — rekenlogica tankbeurten (pure functies, testbaar)

/** Normaliseer komma-invoer naar getal. "42,5" -> 42.5. Ongeldig -> null */
function parseNumber(raw) {
  if (raw === null || raw === undefined) return null;
  const s = String(raw).trim().replace(',', '.');
  if (!/^\d+(\.\d+)?$/.test(s)) return null;
  const n = parseFloat(s);
  return n > 0 ? n : null;
}

/**
 * Verbruik over een interval tussen twee volle tanks.
 * liters = getankt bij de TWEEDE beurt, kmOud/kmNieuw = km-standen.
 * Retourneert L/100km of null bij ongeldige invoer.
 */
function verbruik(liters, kmOud, kmNieuw) {
  const l = typeof liters === 'number' ? liters : parseNumber(liters);
  const o = typeof kmOud === 'number' ? kmOud : parseNumber(kmOud);
  const n = typeof kmNieuw === 'number' ? kmNieuw : parseNumber(kmNieuw);
  if (l === null || o === null || n === null) return null;
  const afstand = n - o;
  if (afstand <= 0) return null;
  return Math.round((l / afstand) * 100 * 10) / 10;
}

/**
 * Gemiddeld verbruik over alle intervallen van een lijst tankbeurten
 * (oplopend op datum). Elke beurt: {liters, km}. Retourneert L/100km of null.
 * Eerste beurt is de nulpunt-meting (volle tank) en levert zelf geen verbruik.
 */
function gemiddeldVerbruik(beurten) {
  if (!Array.isArray(beurten) || beurten.length < 2) return null;
  let totLiters = 0;
  let ok = true;
  for (let i = 1; i < beurten.length; i++) {
    const v = verbruik(beurten[i].liters, beurten[i - 1].km, beurten[i].km);
    if (v === null) { ok = false; break; }
    // gewogen gemiddelde: som liters / som km
    totLiters += Number(beurten[i].liters);
  }
  if (!ok) return null;
  const totKm = Number(beurten[beurten.length - 1].km) - Number(beurten[0].km);
  if (totKm <= 0) return null;
  return Math.round((totLiters / totKm) * 100 * 10) / 10;
}

/** Kosten per kilometer in euro's (afgerond op cent), of null. */
function kostenPerKm(liters, kmOud, kmNieuw, bedrag) {
  const b = typeof bedrag === 'number' ? bedrag : parseNumber(bedrag);
  const o = typeof kmOud === 'number' ? kmOud : parseNumber(kmOud);
  const n = typeof kmNieuw === 'number' ? kmNieuw : parseNumber(kmNieuw);
  if (b === null || o === null || n === null) return null;
  const afstand = n - o;
  if (afstand <= 0) return null;
  return Math.round((b / afstand) * 100) / 100;
}

/** Totaal uitgegeven bedrag dit kalendermaand (beurten: {datum:'YYYY-MM-DD', bedrag}). */
function uitgavenDezeMaand(beurten, maand /* 'YYYY-MM' */) {
  if (!Array.isArray(beurten)) return 0;
  let tot = 0;
  for (const b of beurten) {
    if (typeof b.datum === 'string' && b.datum.startsWith(maand)) {
      tot += Number(b.bedrag) || 0;
    }
  }
  return Math.round(tot * 100) / 100;
}

if (typeof module !== 'undefined') {
  module.exports = { parseNumber, verbruik, gemiddeldVerbruik, kostenPerKm, uitgavenDezeMaand };
}
