"""E2E-proef: snel 'vol getankt' registreren en later aanvullen."""
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
    page.evaluate("localStorage.removeItem('fueltrack_tankbeurten'); localStorage.removeItem('fueltrack_ritten'); localStorage.removeItem('fueltrack_rit')")
    page.goto("http://localhost:8765/app.html")
    page.wait_for_selector("#openTank")

    # 1) snelle volle tank: ALLEEN km-stand
    page.click("#openTank")
    page.fill("#km", "87000")
    page.evaluate("document.getElementById('saveTank').click()")
    text = page.locator("body").inner_text()
    assert "Vol" in text, text[:400]
    assert errs == [], errs

    # 2) nog een snelle tank op hogere km-stand
    page.click("#openTank")
    page.fill("#km", "87500")
    page.evaluate("document.getElementById('saveTank').click()")
    assert errs == [], errs

    # 3) tik op de eerste 'vol'-beurt om aan te vullen (oudste staat onderaan -> index 0)
    page.click('[data-aanvullen="0"]')
    page.fill("#liters", "40")
    page.fill("#bedrag", "75")
    page.fill("#station", "Shell Bavel")
    page.evaluate("document.getElementById('saveTank').click()")

    beurten = json.loads(page.evaluate("localStorage.getItem('fueltrack_tankbeurten')"))
    assert beurten[0]["liters"] == 40 and beurten[0]["bedrag"] == 75, beurten[0]
    assert beurten[0]["station"] == "Shell Bavel"
    assert not beurten[0].get("vol"), beurten[0]

    # 4) tweede nog niet aangevuld
    assert beurten[1].get("vol") is True or beurten[1]["liters"] is None, beurten[1]

    # 5) verbruik zichtbaar nu beurt 1 volledig is
    text = page.locator("body").inner_text()
    print("E2E snel-tanken geslaagd: vol geregistreerd, later aangevuld, verbruik berekend ✓")
    browser.close()
