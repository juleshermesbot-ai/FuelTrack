// Tests grensvoordeel (node grens_test.js)
const assert = require('assert');
const { grensvoordeel, formatEuro } = require('./grens');

let n = 0;
const t = (naam, fn) => { fn(); n++; console.log('  ✓', naam); };

console.log('grensvoordeel');
t('duidelijk voordelig scenario', () => {
  // 10 km heen, 6.5 L/100km, NL €2,10 vs DE €1,75, 45 liter
  const r = grensvoordeel({ afstandHeenM: 10000, verbruikL100km: 6.5, prijsNL: 2.10, prijsBuitenland: 1.75, litersGetankt: 45 });
  // besparing: 0.35*45 = 15.75 ; rit: 20 km => 1.3 L * 2.10 = 2.73 ; netto ~13.02
  assert(r.loont === true);
  assert(Math.abs(r.netto - 13.02) < 0.02, JSON.stringify(r));
});
t('niet voordelig bij kleine prijsverschillen', () => {
  const r = grensvoordeel({ afstandHeenM: 40000, verbruikL100km: 8, prijsNL: 2.00, prijsBuitenland: 1.95, litersGetankt: 40 });
  assert(r.loont === false, JSON.stringify(r));
});
t('zelfde prijs = geen besparing', () => {
  const r = grensvoordeel({ afstandHeenM: 5000, verbruikL100km: 6, prijsNL: 2.00, prijsBuitenland: 2.00, litersGetankt: 40 });
  assert.strictEqual(r.brandstofbesparing, 0);
  assert(r.netto < 0 && r.loont === false);
});
t('buitenland duurder -> negatief', () => {
  const r = grensvoordeel({ afstandHeenM: 5000, verbruikL100km: 6, prijsNL: 2.00, prijsBuitenland: 2.30, litersGetankt: 40 });
  assert.strictEqual(r.brandstofbesparing, 0);
  assert(r.netto < 0);
});
t('komma-invoer werkt', () => {
  const r = grensvoordeel({ afstandHeenM: '10000', verbruikL100km: '6,5', prijsNL: '2,10'.replace(',','.'), prijsBuitenland: 1.75, litersGetankt: '45' });
  assert(r !== null && r.loont === true);
});
t('ongeldige invoer -> null', () => {
  assert.strictEqual(grensvoordeel({ afstandHeenM: -5, verbruikL100km: 6, prijsNL: 2, prijsBuitenland: 1.8, litersGetankt: 40 }), null);
  assert.strictEqual(grensvoordeel({ afstandHeenM: 5000, verbruikL100km: 0, prijsNL: 2, prijsBuitenland: 1.8, litersGetankt: 40 }), null);
  assert.strictEqual(grensvoordeel({}), null);
});

console.log('formatEuro');
t('4.8 -> "€ 4,80"', () => assert.strictEqual(formatEuro(4.8), '€ 4,80'));
t('-2.5 -> "-€ 2,50"', () => assert.strictEqual(formatEuro(-2.5), '-€ 2,50'));
t('ongeldig -> streepje', () => assert.strictEqual(formatEuro(NaN), '—'));

console.log(`\nAlle ${n} grens-tests geslaagd ✓`);
