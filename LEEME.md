# Portafolio estático

Funciona sin servidor: abrí `index.html` con doble clic y listo. Para publicarlo, subí la carpeta a GitHub Pages, Netlify o cualquier hosting estático.

## Estructura

```
index.html
css/estilos.css
js/app.js
data/proyectos.js        ← lo único que hay que editar
assets/
  cv.pdf                 ← opcional
  proyectos/
    mi-proyecto/
      portada.png
      demo.mp4
      captura-1.png
```

## Agregar un proyecto

1. Creá una carpeta en `assets/proyectos/` con el nombre del proyecto y poné ahí imágenes y videos.
2. En `data/proyectos.js`, copiá un bloque `{ ... }` dentro de `proyectos` y completalo.
3. El `id` tiene que ser único y sin espacios (se usa en la URL: `#/proyecto/mi-id`).

Campos disponibles (todos opcionales salvo `id` y `titulo`):

| Campo | Qué es |
|---|---|
| `resumen` | Una línea que aparece en la tarjeta y bajo el título |
| `fecha`, `estado` | Ej: `"2026"`, `"En desarrollo"` |
| `destacado` | `true` lo pone primero en el resumen, la vitrina y la grilla |
| `color` | Color de fondo del proyecto en la vitrina de la portada (ej. `"#2a2f52"`); si falta, se usa uno de la paleta |
| `tags` | Tecnologías; generan los filtros automáticamente |
| `portada` | Imagen de la tarjeta (ideal 16:9) |
| `descripcion` | Texto o lista de párrafos |
| `comoFunciona` | Pasos numerados: `[{ titulo, texto }]` |
| `caracteristicas` | Lista de puntos |
| `arquitectura` | Texto libre |
| `videos` | `{ tipo: "archivo", src, titulo, poster }` o `{ tipo: "youtube", id, titulo }` |
| `imagenes` | `[{ src, titulo }]`, se abren ampliadas al hacer clic |
| `resultados` | Excel/CSV, PDF o imágenes: `[{ src, titulo, resaltar }]`. Ver "Resultados con Excel" |
| `enlaces` | `[{ texto, url }]`, ej. repositorio o demo |

En los textos podés usar `**negrita**` y `` `código` ``.

## Resultados con Excel

El navegador no puede leer un `.xlsx` abierto desde el disco, así que se convierte una vez a un `.js` que queda al lado del Excel:

```
pip install openpyxl
python herramientas/excel_a_js.py
```

Convierte todos los `.xlsx` y `.csv` dentro de `assets/`. Volvé a ejecutarlo cada vez que cambies un Excel. En la página se ve cada hoja como una pestaña con su tabla, más un botón para descargar el Excel original.

`resaltar` marca filas según el valor de la primera columna:

```js
resultados: [
  { src: "assets/proyectos/mi-tp/resultados.xlsx", titulo: "Resultados",
    resaltar: [{ valor: 8, etiqueta: "óptimo" }] }
]
```

Si `src` es una imagen (.png, .jpg, .svg), se muestra como una captura. Si es un `.pdf`, se muestra embebido con botones para abrirlo y descargarlo (en celulares, solo los botones).

## Videos

- **Archivo local (.mp4)**: funciona siempre, también abriendo con doble clic. Usá MP4 con H.264; si sale de OBS en .mkv, remuxealo a .mp4 (OBS: Archivo → Remux).
- **YouTube** (ideal para videos pesados, se puede subir como "no listado"): el `id` es lo que va después de `v=` en la URL. YouTube no permite incrustar videos en páginas abiertas desde el disco, así que localmente se muestra un botón "Ver en YouTube"; una vez publicado el sitio, se ve el reproductor embebido.
- GitHub Pages rechaza archivos de más de 100 MB; para videos largos conviene YouTube.

## Publicar en GitHub Pages

1. Creá un repositorio (ej. `tu-usuario.github.io`) y subí el contenido de esta carpeta.
2. Settings → Pages → Source: rama `main`, carpeta `/ (root)`.
3. Queda en `https://tu-usuario.github.io`.

## Borrar los ejemplos

Los dos proyectos y `assets/proyectos/ejemplo/` son de muestra: reemplazalos por los tuyos.
