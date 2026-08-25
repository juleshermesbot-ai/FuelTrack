# Bouwplan

## Fase 1 — Auto en RDW (afgerond)
- Kenteken normaliseren en valideren.
- Voertuig- en brandstofgegevens via twee RDW-endpoints ophalen.
- Tankinhoud handmatig toevoegen.
- Auto lokaal bewaren.

Acceptatie: een bestaand kenteken toont echte RDW-gegevens; een ongeldig/onbekend kenteken geeft een duidelijke fout.

## Fase 2 — Tankbeurten en verbruik (afgerond)
- Eerst gedragstests voor L/100 km, bedragen en ongeldige invoer.
- Volle tank registreren met datum, liters, totaalbedrag en km-stand/GPS-afstand.
- Tankbeurten lokaal opslaan.
- Verbruik per volle-tankinterval en maandtotaal tonen.

## Fase 3 — GPS-ritten (afgerond)
- Eerst tests voor afstandsberekening, foutmarges en ritstatus.
- Start/stop rit.
- Geolocation-punten optellen en onrealistische GPS-sprongen negeren.
- Rit en kilometers lokaal bewaren.
- iOS-beperkingen duidelijk tonen.

## Fase 4 — Grensvoordeel (afgerond)
- Kosten van heen/terugrit berekenen met werkelijk gemeten verbruik.
- Besparing bij een prijsverschil per liter berekenen.
- Eerst handmatige prijzen; live prijsbron alleen wanneer betrouwbaar en legaal beschikbaar.

## Fase 5 — PWA-installatie
- Manifest, app-iconen en service worker.
- Offline app-shell.
- Echte installatieproef op iPhone via ‘Zet op beginscherm’.
