"""Echte browserproef voor fase 2. Vereist lokale server op poort 8765."""
import json
from playwright.sync_api import sync_playwright

CAR = {
    "kenteken": "8KTJ69",
    "merk": "VOLKSWAGEN",
    "handelsbenaming": "POLO",
    "brandstof": "Benzine",
    "tank_liters": 45,
}

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("http://localhost:8765/app.html")
    page.evaluate("([k,v]) => localStorage.setItem(k,v)", ["fueltrack_car", json.dumps(CAR)])
    page.evaluate("localStorage.removeItem('fueltrack_tankbeurten')")
    page.goto("http://localhost:8765/app.html")

    # Eerste volle tank: nulpunt
    page.click("#openTank")
    page.fill("#km", "87000")
    page.fill("#liters", "40")
    page.fill("#bedrag", "75")
    page.fill("#station", "Shell Bavel")
    page.click("#saveTank")
    assert "1 tankbeurten" in page.locator("body").inner_text()
    assert "87.000" in page.locator("body").inner_text()

    # Tweede volle tank: 40 liter over 650 km => 6,2 L/100 km
    page.click("#openTank")
    page.fill("#km", "87650")
    page.fill("#liters", "40")
    page.fill("#bedrag", "78.90")
    page.fill("#station", "TinQ Breda")
    page.click("#saveTank")
    text = page.locator("body").inner_text()
    assert "6,2 L/100km" in text, text
    assert "87.650" in text, text
    assert "2 tankbeurten" in text, text
    print("E2E geslaagd: 2 tankbeurten, 6,2 L/100km en 87.650 km zichtbaar")
    browser.close()
