// Tests GPS-logica (node gps_test.js)
const assert = require('assert');
const { afstandMeters, ritLengte, formatKm } = require('./gps');

let n = 0;
const t = (naam, fn) => { fn(); n++; console.log('  ✓', naam); };

console.log('afstandMeters');
// Breda -> Bavel is grofweg ~5 km; gebruik bekende punten:
t('Breda centrum -> Breda station ~1-2 km', () => {
  const d = afstandMeters(51.5883, 4.7758, 51.5900, 4.7983);
  assert(d > 1000 && d < 2500, 'onverwacht: ' + d);
});
t('zelfde punt = 0 m', () => assert.strictEqual(afstandMeters(51.5, 4.7, 51.5, 4.7), 0));
t('ongeldige latitude -> null', () => assert.strictEqual(afstandMeters(95, 4.7, 51.5, 4.7), null));
t('ongeldige longitude -> null', () => assert.strictEqual(afstandMeters(51.5, 200, 51.5, 4.7), null));

console.log('ritLengte');
t('gewone rit telt stapjes op', () => {
  const pts = [
    { lat: 51.5000, lon: 4.7000 },
    { lat: 51.5050, lon: 4.7000 },
    { lat: 51.5100, lon: 4.7000 },
  ];
  const totaal = ritLengte(pts);
  // elk stapje ~556 m => totaal ~1112
  assert(totaal > 1000 && totaal < 1250, 'onverwacht: ' + totaal);
});
t('staan stil (stapjes < 5 m) telt niet', () => {
  const pts = [
    { lat: 51.500000, lon: 4.700000 },
    { lat: 51.500001, lon: 4.700000 }, // ~0.11 m
    { lat: 51.500002, lon: 4.700001 },
  ];
  assert.strictEqual(ritLengte(pts), 0);
});
t('GPS-sprong (>2000 m in één stap) wordt genegeerd', () => {
  const pts = [
    { lat: 51.5000, lon: 4.7000 },
    { lat: 51.6000, lon: 4.9000 }, // sprong van meerdere km
    { lat: 51.6010, lon: 4.9010 }, // geldig vervolg
  ];
  const totaal = ritLengte(pts);
  // alleen het laatste stukje telt (~140 m), niet de sprong
  assert(totaal < 500, 'onverwacht: ' + totaal);
});
t('ongeldige punten worden overgeslagen', () => {
  const pts = [
    { lat: 51.5000, lon: 4.7000 },
    { lat: 'x', lon: 4.7050 },
    { lat: 51.5050, lon: 4.7000 },
  ];
  const totaal = ritLengte(pts);
  assert(totaal > 400 && totaal < 700, 'onverwacht: ' + totaal);
});
t('lege/ongeldige invoer', () => {
  assert.strictEqual(ritLengte([]), 0);
  assert.strictEqual(ritLengte(null), null);
});

console.log('formatKm');
t('850 m blijft meters', () => assert.strictEqual(formatKm(850), '850 m'));
t('12400 m -> "12,4 km"', () => assert.strictEqual(formatKm(12400), '12,4 km'));
t('ongeldig -> streepje', () => assert.strictEqual(formatKm(NaN), '—'));

console.log(`\nAlle ${n} GPS-tests geslaagd ✓`);
