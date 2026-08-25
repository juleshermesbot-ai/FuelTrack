# FuelTrack — Projectbrief

## Doel
Een mobiele PWA voor iPhone waarmee Jules autogegevens, tankbeurten, verbruik en gereden GPS-kilometers lokaal bijhoudt.

## Gebruikersroute
1. Kenteken invoeren en autogegevens ophalen via RDW.
2. Eenmalig tankinhoud zelf invoeren.
3. Bij een volle tank liters en totaalprijs registreren.
4. Ritten via GPS meten zolang de PWA actief is.
5. L/100 km en maandelijkse brandstofkosten bekijken.
6. Later berekenen of tanken over de grens loont.

## Privacy
- Rit- en tankgegevens blijven lokaal op de telefoon.
- Geen accounts, advertenties of externe opslag.
- RDW ontvangt alleen het ingevoerde kenteken via zijn openbare API.

## Belangrijke beperking
Een iPhone-PWA kan GPS gebruiken, maar iOS kan tracking pauzeren zodra Safari/de PWA langdurig op de achtergrond staat of wordt afgesloten. Betrouwbare permanente achtergrondtracking vereist later een echte native iOS-app.
