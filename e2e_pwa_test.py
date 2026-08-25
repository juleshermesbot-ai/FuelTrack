"""E2E-proef fase 5: manifest, service worker en offline beschikbaarheid."""
import json
from playwright.sync_api import sync_playwright

CAR = {"kenteken": "8KTJ69", "merk": "VOLKSWAGEN", "handelsbenaming": "POLO", "brandstof": "Benzine", "tank_liters": 45}

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    ctx = browser.new_context()
    page = ctx.new_page()
    errs = []
    page.on("pageerror", lambda e: errs.append(str(e)))

    # seed data via ?seed (geen redirect)
    page.goto("http://localhost:8765/app.html?seed")
    page.evaluate("([k,v]) => localStorage.setItem(k,v)", ["fueltrack_car", json.dumps(CAR)])
    page.goto("http://localhost:8765/app.html")

    # manifest is geldig bereikbaar
    res = page.request.get("http://localhost:8765/manifest.json")
    assert res.ok
    man = res.json()
    assert man["start_url"] == "/app.html" and man["display"] == "standalone"

    # service worker registreert zonder fouten
    page.wait_for_function("navigator.serviceWorker.ready.then(() => true)", timeout=15000)
    scope = page.evaluate("navigator.serviceWorker.getRegistrations().then(r => r.length ? r[0].scope : null)")
    assert scope and scope.endswith("/"), scope

    # offline: ga offline en herlaad — app-shell moet uit cache komen
    ctx.set_offline(True)
    page.reload()
    text = page.locator("body").inner_text()
    assert "FuelTrack" in text, text[:200]
    assert not [e for e in errs if "net" in e.lower()], errs
    ctx.set_offline(False)

    # icoon bestaat
    assert page.request.get("http://localhost:8765/icons/appicon-180.png").ok

    print("E2E fase 5 geslaagd: manifest OK, service worker actief, app start offline, iconen aanwezig")
    browser.close()
