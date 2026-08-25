"""E2E-proef fase 3: rit starten, GPS-punten injecteren, stoppen, km geregistreerd."""
import json
from playwright.sync_api import sync_playwright

CAR = {"kenteken": "8KTJ69", "merk": "VOLKSWAGEN", "handelsbenaming": "POLO", "brandstof": "Benzine", "tank_liters": 45}

# route Breda -> richting Bavel, stapjes van ~0.005 graad lat (~555 m), 10 punten
PUNTEN = [{"lat": 51.5700 + i*0.005, "lon": 4.7600 + i*0.002, "t": 1000*i} for i in range(10)]

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    ctx = browser.new_context(permissions=["geolocation"])
    page = ctx.new_page()
    page.goto("http://localhost:8765/app.html")
    page.evaluate("([k,v]) => localStorage.setItem(k,v)", ["fueltrack_car", json.dumps(CAR)])
    page.evaluate("localStorage.removeItem('fueltrack_ritten'); localStorage.removeItem('fueltrack_rit')")
    page.goto("http://localhost:8765/app.html")
    page.wait_for_selector("#startRit")

    body = page.locator("body").inner_text()
    assert "Nog geen ritten" in body, body

    # start rit
    page.click("#startRit")
    assert page.locator("#stopRit").count() == 1

    # gesimuleerde gps-punten in de lopende rit zetten (zoals watchPosition zou doen)
    page.evaluate("pts => { const r = JSON.parse(localStorage.getItem('fueltrack_rit')); r.punten = pts; localStorage.setItem('fueltrack_rit', JSON.stringify(r)); }", PUNTEN)
    page.reload()  # render opnieuw; hervatWatch herstelt de actieve rit
    text = page.locator("body").inner_text()
    assert "Rit bezig" in text or "GPS registreren" in text, text
    # ~9 stappen x ~590 m ≈ 5,3 km
    assert "km" in text

    # stop rit
    page.click("#stopRit")
    text = page.locator("body").inner_text()
    assert "Laatste rit" in text, text
    meters = page.evaluate("JSON.parse(localStorage.getItem('fueltrack_ritten'))[0].meters")
    assert 4500 < meters < 6500, f"onrealistische afstand: {meters}"
    print(f"E2E fase 3 geslaagd: rit geregistreerd als {meters} m")
    browser.close()
