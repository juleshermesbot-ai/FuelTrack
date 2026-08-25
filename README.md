# FuelTrack

Een PWA (web-app) om Jules' benzineverbruik en kilometers bij te houden.
Werkt op iPhone via Safari → "Zet op beginscherm".

## Fasen
1. **Fase 1** — Kentekencheck: kenteken invoeren, autogegevens ophalen via RDW open data
2. **Fase 2** — Tankbeurten: liters + bedrag + km-stand invoeren, verbruik berekenen (L/100km), opslag in localStorage
3. **Fase 3** — GPS-kilometers: afstand meten tijdens het rijden (Geolocation API)
4. **Fase 4** — Grensvoordeel: berekenen of tanken in Duitsland/België loont

## Status
- Fase 1: bezig
- Ontwerp: `SchoolAgent/sketches/002-wallet-ios/index.html` (donker iOS Liquid Glass, 3D-emoji-iconen)

## Techniek
- Gewone HTML/CSS/JS, geen frameworks
- Data lokaal op de telefoon (localStorage), niets naar servers
- Kentekencheck via RDW API: https://opendata.rdw.nl resource `m9d7-ebf2`
