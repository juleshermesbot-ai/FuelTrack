"""Genereert ronde app-iconen (180 en 512 px) uit de 3D-auto-emoji op een donkere gradient."""
import io, urllib.request
from PIL import Image, ImageDraw

BASE = "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Sport%20utility%20vehicle/3D/sport_utility_vehicle_3d.png"
car = Image.open(io.BytesIO(urllib.request.urlopen(BASE).read())).convert("RGBA")

def maak(size, uit):
    S = 4  # supersample
    s = size * S
    img = Image.new("RGBA", (s, s), (0,0,0,0))
    # donkere gradient-achtergrond in cirkel
    grad = Image.new("RGBA", (s, s))
    top = (18, 26, 40); bottom = (5, 7, 12)
    for y in range(s):
        t = y / s
        kleur = tuple(int(top[i]*(1-t) + bottom[i]*t) for i in range(3)) + (255,)
        for x_inhoud in range(s):
            pass
    # sneller: per rij een lijn tekenen
    d = ImageDraw.Draw(grad)
    for y in range(s):
        t = y / s
        kleur = tuple(int(top[i]*(1-t) + bottom[i]*t) for i in range(3)) + (255,)
        d.line([(0,y),(s,y)], fill=kleur)
    mask = Image.new("L",(s,s),0)
    ImageDraw.Draw(mask).ellipse([0,0,s,s], fill=255)
    img.paste(grad,(0,0),mask)
    # auto gecentreerd (~72% breedte)
    cw = int(s*0.74)
    car2 = car.resize((cw,cw), Image.LANCZOS)
    pos = ((s-cw)//2, (s-cw)//2)
    img.alpha_composite(car2, pos)
    img = img.resize((size,size), Image.LANCZOS)
    img.save(uit)
    print("gemaakt:", uit)

maak(512, "icons/appicon-512.png")
maak(180, "icons/appicon-180.png")
