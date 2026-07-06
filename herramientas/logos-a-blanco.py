#!/usr/bin/env python3
"""
LOGOS-A-BLANCO — Convierte los PNG de assets/img/logos/ a blanco puro.

Uso:
    python3 herramientas/logos-a-blanco.py

Qué hace con cada .png de assets/img/logos/:
  1. Si tiene transparencia: conserva la silueta (canal alfa) y pinta
     todo el logo de blanco #FFFFFF.
  2. Si NO tiene transparencia (fondo sólido): calcula la silueta a
     partir del contraste (sube sombras y luces) y luego la pinta de
     blanco sobre fondo transparente.
  3. Guarda una copia del original en assets/img/logos/originales/
     y sobrescribe el .png con la versión en blanco.

Requiere Pillow:  python3 -m pip install pillow
"""
import sys
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("Falta Pillow. Instálalo con:  python3 -m pip install pillow")

CARPETA = Path(__file__).resolve().parent.parent / "assets" / "img" / "logos"
ORIGINALES = CARPETA / "originales"


def a_blanco(ruta: Path) -> None:
    img = Image.open(ruta).convert("RGBA")
    r, g, b, a = img.split()

    # ¿Tiene transparencia real?
    tiene_alfa = any(px < 250 for px in a.getdata())

    if tiene_alfa:
        alfa = a
    else:
        # Fondo sólido: la silueta sale del contraste (luminancia).
        gris = ImageOps.autocontrast(img.convert("L"))  # sube sombras y luces
        # ¿El fondo es claro u oscuro? Se estima con las 4 esquinas.
        w, h = gris.size
        esquinas = [gris.getpixel(p) for p in ((0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1))]
        fondo_claro = sum(esquinas) / 4 > 127
        alfa = ImageOps.invert(gris) if fondo_claro else gris

    blanco = Image.new("RGBA", img.size, (255, 255, 255, 0))
    blanco.putalpha(alfa)

    ORIGINALES.mkdir(exist_ok=True)
    respaldo = ORIGINALES / ruta.name
    if not respaldo.exists():
        Image.open(ruta).save(respaldo)

    blanco.save(ruta)
    print(f"✓ {ruta.name} → blanco")


def main() -> None:
    if not CARPETA.exists():
        sys.exit(f"No existe la carpeta {CARPETA}")
    pngs = [p for p in sorted(CARPETA.glob("*.png")) if p.parent == CARPETA]
    if not pngs:
        sys.exit(f"No hay archivos .png en {CARPETA}. Copia ahí tus logos primero.")
    for p in pngs:
        a_blanco(p)
    print(f"\nListo: {len(pngs)} logo(s) convertidos. Los originales quedaron en {ORIGINALES}/")


if __name__ == "__main__":
    main()
