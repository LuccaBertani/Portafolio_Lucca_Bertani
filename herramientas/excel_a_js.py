"""Convierte cada .xlsx / .csv de assets/proyectos en un .js al lado, que la página puede cargar sin servidor.

Uso (desde la carpeta del portafolio):  python herramientas/excel_a_js.py
Requiere openpyxl:  pip install openpyxl
"""
import csv
import json
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent


def limpiar(valor):
    if isinstance(valor, float):
        return round(valor, 4)
    if isinstance(valor, str):
        return valor.strip()
    return valor


def armar_hoja(nombre, filas):
    filas = [[limpiar(v) for v in f] for f in filas]
    # Saca columnas y filas vacías del final
    while filas and all(v in (None, "") for v in filas[-1]):
        filas.pop()
    ancho = max((max((i + 1 for i, v in enumerate(f) if v not in (None, "")), default=0) for f in filas), default=0)
    filas = [f[:ancho] + [None] * (ancho - len(f)) for f in filas]
    if not filas:
        return {"nombre": nombre, "columnas": None, "filas": []}

    # La primera fila es encabezado si es todo texto y debajo hay números
    primera = filas[0]
    todo_texto = all(isinstance(v, str) for v in primera if v is not None)
    hay_numeros = any(isinstance(v, (int, float)) for f in filas[1:] for v in f)
    if todo_texto and hay_numeros and len(filas) > 1:
        return {"nombre": nombre, "columnas": primera, "filas": filas[1:]}
    return {"nombre": nombre, "columnas": None, "filas": filas}


def leer_xlsx(ruta):
    import openpyxl
    wb = openpyxl.load_workbook(ruta, data_only=True, read_only=True)
    return [armar_hoja(ws.title, [list(f) for f in ws.iter_rows(values_only=True)]) for ws in wb.worksheets]


def leer_csv(ruta):
    with open(ruta, newline="", encoding="utf-8-sig") as f:
        filas = []
        for fila in csv.reader(f):
            convertida = []
            for v in fila:
                try:
                    convertida.append(float(v) if "." in v else int(v))
                except ValueError:
                    convertida.append(v or None)
            filas.append(convertida)
    return [armar_hoja(ruta.stem, filas)]


def main():
    archivos = [p for p in (RAIZ / "assets").rglob("*") if p.suffix.lower() in (".xlsx", ".csv") and not p.name.startswith("~$")]
    if not archivos:
        print("No se encontraron .xlsx ni .csv en assets/")
        return
    for ruta in archivos:
        hojas = leer_xlsx(ruta) if ruta.suffix.lower() == ".xlsx" else leer_csv(ruta)
        clave = ruta.relative_to(RAIZ).as_posix()
        salida = ruta.with_suffix(".js")
        datos = json.dumps({"hojas": hojas}, ensure_ascii=False, separators=(",", ":"))
        salida.write_text(
            "// Generado por herramientas/excel_a_js.py a partir de " + ruta.name + ". No editar a mano.\n"
            "window.RESULTADOS = window.RESULTADOS || {};\n"
            f"window.RESULTADOS[{json.dumps(clave)}] = {datos};\n",
            encoding="utf-8",
        )
        print(f"{clave} -> {salida.relative_to(RAIZ).as_posix()} ({len(hojas)} hojas)")


if __name__ == "__main__":
    sys.exit(main())
