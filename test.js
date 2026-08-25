// Tests voor FuelTrack rekenlogica (node test.js)
const assert = require('assert');
const { parseNumber, verbruik, gemiddeldVerbruik, kostenPerKm, uitgavenDezeMaand } = require('./calc');

let n = 0;
function t(naam, fn) { fn(); n++; console.log('  ✓', naam); }

console.log('parseNumber');
t('"42,5" -> 42.5', () => assert.strictEqual(parseNumber('42,5'), 42.5));
t('42 -> 42', () => assert.strictEqual(parseNumber(42), 42));
t('"abc" -> null', () => assert.strictEqual(parseNumber('abc'), null));
t('"0" -> null', () => assert.strictEqual(parseNumber('0'), null));
t('"" -> null', () => assert.strictEqual(parseNumber(''), null));

console.log('verbruik');
t('40 L op 650 km = 6.2', () => assert.strictEqual(verbruik(40, 87000, 87650), 6.2));
t('komma-invoer werkt', () => assert.strictEqual(verbruik('42,5', '86980', '87650'), 6.3));
t('zelfde km-stand -> null', () => assert.strictEqual(verbruik(40, 87000, 87000), null));
t('teruglopende stand -> null', () => assert.strictEqual(verbruik(40, 87000, 86000), null));
t('ongeldige liters -> null', () => assert.strictEqual(verbruik('x', 1, 2), null));

console.log('gemiddeldVerbruik');
t('gewogen gemiddelde van 3 beurten', () => {
  const beurten = [
    { liters: 40, km: 87000 },
    { liters: 38, km: 87500 },
    { liters: 42, km: 88200 },
  ];
  // totaal 80 L over 1200 km = 6.7
  assert.strictEqual(gemiddeldVerbruik(beurten), 6.7);
});
t('minder dan 2 beurten -> null', () => assert.strictEqual(gemiddeldVerbruik([{liters:40,km:1}]), null));
t('kapotte reeks -> null', () => assert.strictEqual(
  gemiddeldVerbruik([{liters:40,km:100},{liters:30,km:90}]), null));

console.log('kostenPerKm');
t('€78,90 over 650 km = €0.12', () => assert.strictEqual(kostenPerKm(40, 87000, 87650, 78.90), 0.12));
t('ongeldig bedrag -> null', () => assert.strictEqual(kostenPerKm(40, 1, 2, 'geen'), null));

console.log('uitgavenDezeMaand');
t('alleen augustus telt', () => {
  const beurten = [
    { datum: '2026-08-03', bedrag: 78.90 },
    { datum: '2026-07-20', bedrag: 60 },
    { datum: '2026-08-24', bedrag: 71.10 },
  ];
  assert.strictEqual(uitgavenDezeMaand(beurten, '2026-08'), 150);
});
t('lege lijst -> 0', () => assert.strictEqual(uitgavenDezeMaand([], '2026-08'), 0));

console.log(`\nAlle ${n} tests geslaagd ✓`);
