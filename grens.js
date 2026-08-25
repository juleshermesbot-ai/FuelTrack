// FuelTrack — grensvoordeel berekening (pure functies, testbaar)

/**
 * Berekent het netto voordeel van tanken over de grens.
 *
 * afstandHeenM     - extra enkele reis in meters naar het goedkope station
 * verbruikL100km   - jouw werkelijke verbruik
 * prijsNL          - literprijs in Nederland (euro)
 * prijsBuitenland  - literprijs over de grens (euro)
 * litersGetankt    - hoeveel je bij dat bezoek tankt (standaard: hele tank)
 *
 * Retourneert { netto, brandstofbesparing, ritkosten } of null bij ongeldige invoer.
 */
function grensvoordeel({ afstandHeenM, verbruikL100km, prijsNL, prijsBuitenland, litersGetankt }) {
  const a = typeof afstandHeenM === 'number' ? afstandHeenM : parseFloat(afstandHeenM);
  const v = typeof verbruikL100km === 'number' ? verbruikL100km : parseFloat(String(verbruikL100km).replace(',', '.'));
  const pNL = typeof prijsNL === 'number' ? prijsNL : parseFloat(prijsNL);
  const pBU = typeof prijsBuitenland === 'number' ? prijsBuitenland : parseFloat(prijsBuitenland);
  const L = typeof litersGetankt === 'number' ? litersGetankt : parseFloat(litersGetankt);

  if (![a, v, pNL, pBU, L].every(x => typeof x === 'number' && isFinite(x))) return null;
  if (a < 0 || v <= 0 || L <= 0) return null;

  // heen én terug
  const totaalKm = (a * 2) / 1000;
  const verbruikRit = (totaalKm / 100) * v;

  const brandstofbesparing = Math.max(0, (pNL - pBU)) * L;
  // brandstof voor de rit is ook goedkoper gekocht... maar simpel & conservatief:
  // we tellen de ritkosten tegen de NL-prijs aan.
  const ritkosten = verbruikRit * pNL;
  const netto = Math.round((brandstofbesparing - ritkosten) * 100) / 100;

  return {
    netto,
    brandstofbesparing: Math.round(brandstofbesparing * 100) / 100,
    ritkosten: Math.round(ritkosten * 100) / 100,
    loont: netto > 0,
  };
}

/** Euro bedrag netjes: "€ 4,80". */
function formatEuro(bedrag) {
  if (typeof bedrag !== 'number' || !isFinite(bedrag)) return '—';
  const teken = bedrag < 0 ? '-' : '';
  return teken + '€ ' + Math.abs(bedrag).toFixed(2).replace('.', ',');
}

if (typeof module !== 'undefined') {
  module.exports = { grensvoordeel, formatEuro };
}
