"""E2E-proef fase 4: grensinstellingen opslaan en voordeel op het dashboard zien."""
import json
from playwright.sync_api import sync_playwright

CAR = {"kenteken": "8KTJ69", "merk": "VOLKSWAGEN", "handelsbenaming": "POLO", "brandstof": "Benzine", "tank_liters": 45}

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    errs = []
    page.on("pageerror", lambda e: errs.append(str(e)))
    page.goto("http://localhost:8765/app.html?seed")
    page.evaluate("([k,v]) => localStorage.setItem(k,v)", ["fueltrack_car", json.dumps(CAR)])
    page.evaluate("""() => {
        localStorage.removeItem('fueltrack_ritten');
        localStorage.removeItem('fueltrack_rit');
        localStorage.removeItem('fueltrack_tankbeurten');
        // twee tankbeurten zodat er een gemiddeld verbruik is
        localStorage.setItem('fueltrack_tankbeurten', JSON.stringify([
            {datum:'2026-08-01', km:87000, liters:40, bedrag:75, station:'Shell Bavel'},
            {datum:'2026-08-20', km:87650, liters:40, bedrag:78.9, station:'TinQ Breda'}
        ]));
    }""")
    page.goto("http://localhost:8765/app.html")
    page.wait_for_selector("#grensInstellen")
    assert errs == [], errs

    # standaardinstellingen tonen een voordeelkaart
    body = page.locator("body").inner_text()
    assert "Slim tanken" in body, body

    # instellen: 15 km heen, 6.2 L/km gemeten, 2.10 vs 1.72, 45 L
    page.click("#grensInstellen")
    page.fill("#gpNL", "2.10")
    page.fill("#gpBU", "1.72")
    page.fill("#gafstand", "15")
    page.fill("#gliters", "45")
    page.click("#grensOpslaan")

    text = page.locator("body").inner_text()
    assert "Tanken over de grens loont!" in text, text
    # besparing 0.38*45=17.10; rit 30km*6.2/100*2.10=3.91 => netto ~13.19
    saved = json.loads(page.evaluate("localStorage.getItem('fueltrack_grens')"))
    assert saved["prijsBuitenland"] == 1.72

    # niet-loont-scenario
    page.click("#grensInstellen")
    page.fill("#gafstand", "80")
    page.fill("#gpBU", "2.05")
    page.click("#grensOpslaan")
    text = page.locator("body").inner_text()
    assert "niet voordelig" in text, text
    print("E2E fase 4 geslaagd: grensvoordeel berekent en toont loont/niet-loont correct")
    browser.close()
