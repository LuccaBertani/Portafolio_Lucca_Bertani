(function () {
  const datos = window.PORTAFOLIO || { perfil: {}, proyectos: [] };
  const perfil = datos.perfil || {};
  const proyectos = datos.proyectos || [];
  const app = document.getElementById("app");
  const esArchivoLocal = location.protocol === "file:";

  let filtroTag = null;
  let textoBusqueda = "";

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // Formato mínimo: **negrita** y `código`
  const fmt = (s) => esc(s)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`(.+?)`/g, "<code>$1</code>");

  const parrafos = (v) => (Array.isArray(v) ? v : [v]).filter(Boolean).map((p) => `<p>${fmt(p)}</p>`).join("");
  const tagsHtml = (tags) => (tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join("");
  const esImagen = (src) => /\.(png|jpe?g|gif|svg|webp)$/i.test(src || "");
  const esPdf = (src) => /\.pdf$/i.test(src || "");
  const externo = (url) => /^https?:/.test(url) ? ' target="_blank" rel="noopener"' : "";

  function iniciarShell() {
    document.getElementById("marca").textContent = perfil.nombre || "Portafolio";
    document.title = perfil.nombre ? `${perfil.nombre} · Portafolio` : "Portafolio";
    document.getElementById("pie").innerHTML =
      `<span>© ${new Date().getFullYear()} ${esc(perfil.nombre)}</span>` +
      (perfil.email ? `<a href="mailto:${esc(perfil.email)}">${esc(perfil.email)}</a>` : "");

    document.getElementById("btnTema").addEventListener("click", () => {
      const raiz = document.documentElement;
      const oscuroActual = raiz.dataset.theme
        ? raiz.dataset.theme === "dark"
        : matchMedia("(prefers-color-scheme: dark)").matches;
      raiz.dataset.theme = oscuroActual ? "light" : "dark";
      try { localStorage.setItem("tema", raiz.dataset.theme); } catch (e) {}
    });

    const lb = document.getElementById("lightbox");
    lb.addEventListener("click", (e) => { if (e.target !== lb.querySelector("img")) lb.hidden = true; });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") lb.hidden = true; });
  }

  function botonesEnlace(enlaces, primero) {
    return (enlaces || []).map((l, i) =>
      `<a class="boton${primero && i === 0 ? " primario" : ""}" href="${esc(l.url)}"${externo(l.url)}>${esc(l.texto)}</a>`
    ).join("");
  }

  function vistaInicio() {
    const todosTags = [...new Set(proyectos.flatMap((p) => p.tags || []))].sort();

    app.innerHTML = `
      <section class="hero">
        <p class="rol">${esc(perfil.rol)}</p>
        <h1>${esc(perfil.nombre)}</h1>
        <p>${fmt(perfil.bio)}</p>
        <div class="enlaces">${botonesEnlace(perfil.enlaces, true)}</div>
      </section>
      ${resumenHtml(todosTags)}
      ${vitrinaHtml()}
      <h2 class="titulo-grilla" id="todos">Todos los proyectos</h2>
      <div class="controles">
        <input class="buscar" type="search" placeholder="Buscar proyecto…" value="${esc(textoBusqueda)}">
        <div class="filtros">
          <button class="chip${filtroTag ? "" : " activo"}" data-tag="">Todos</button>
          ${todosTags.map((t) => `<button class="chip${t === filtroTag ? " activo" : ""}" data-tag="${esc(t)}">${esc(t)}</button>`).join("")}
        </div>
      </div>
      <div class="grilla" id="grilla"></div>`;

    app.querySelector(".buscar").addEventListener("input", (e) => {
      textoBusqueda = e.target.value;
      pintarGrilla();
    });
    app.querySelectorAll(".chip").forEach((b) => b.addEventListener("click", () => {
      filtroTag = b.dataset.tag || null;
      app.querySelectorAll(".chip").forEach((c) => c.classList.toggle("activo", c === b));
      pintarGrilla();
    }));
    pintarGrilla();

    app.querySelectorAll("[data-salto]").forEach((a) => a.addEventListener("click", (e) => {
      e.preventDefault();
      irAPanel(+a.dataset.salto);
    }));
    iniciarVitrina();
  }

  // Proyectos en el orden en que se muestran en el resumen y la vitrina
  const ordenados = () => [...proyectos].sort((a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0));
  const PALETA = ["#1f3d36", "#2a2f52", "#4b2733", "#1f3a4d", "#3f3520", "#33284a", "#2d4030"];
  const colorDe = (p, i) => p.color || PALETA[i % PALETA.length];
  const dosDigitos = (n) => String(n).padStart(2, "0");

  function resumenHtml(todosTags) {
    if (!proyectos.length) return "";
    return `
      <section class="resumen-proyectos">
        <div class="cifras">
          <div><strong>${proyectos.length}</strong><span>proyectos</span></div>
          <div><strong>${todosTags.length}</strong><span>tecnologías</span></div>
        </div>
        <ol class="indice-proyectos">
          ${ordenados().map((p, i) => `
            <li>
              <a href="#/" data-salto="${i}">
                <span class="num">${dosDigitos(i + 1)}</span>
                <span class="nombre">${esc(p.titulo)}</span>
                <span class="tecs">${esc((p.tags || []).slice(0, 3).join(" · "))}</span>
                <span class="flecha" aria-hidden="true">↓</span>
              </a>
            </li>`).join("")}
        </ol>
      </section>`;
  }

  function vitrinaHtml() {
    const lista = ordenados();
    if (!lista.length) return "";
    return `
      <section class="vitrina" id="vitrina" style="--color:${colorDe(lista[0], 0)}">
        ${lista.map((p, i) => `
          <article class="panel${i === 0 ? " activo" : ""}" data-i="${i}">
            <div class="panel-texto">
              <p class="panel-num">${dosDigitos(i + 1)} <span>/ ${dosDigitos(lista.length)}</span></p>
              <h2>${esc(p.titulo)}</h2>
              <p class="panel-resumen">${fmt(p.resumen)}</p>
              <div class="panel-tags">${(p.tags || []).map((t) => `<span>${esc(t)}</span>`).join("")}</div>
              <a class="boton-claro" href="#/proyecto/${encodeURIComponent(p.id)}">Ver proyecto →</a>
            </div>
            <div class="panel-img">${p.portada ? `<img src="${esc(p.portada)}" alt="">` : ""}</div>
          </article>`).join("")}
        <nav class="puntos" aria-label="Proyectos">
          ${lista.map((p, i) => `<button type="button" data-salto="${i}" class="${i === 0 ? "activo" : ""}" aria-label="${esc(p.titulo)}"></button>`).join("")}
        </nav>
        <div class="progreso"><span></span></div>
      </section>`;
  }

  // Cada proyecto es una sección en flujo normal: si su contenido es más alto que la pantalla, se sigue bajando dentro de él
  let alScroll = null;

  function irAPanel(i) {
    const panel = document.querySelectorAll("#vitrina .panel")[i];
    if (!panel) return;
    window.scrollTo({ top: panel.getBoundingClientRect().top + window.scrollY, behavior: "smooth" });
  }

  function iniciarVitrina() {
    const v = document.getElementById("vitrina");
    if (!v) return;
    const lista = ordenados();
    const paneles = [...v.querySelectorAll(".panel")];
    const puntos = v.querySelectorAll(".puntos button");
    const barra = v.querySelector(".progreso span");
    let actual = 0;
    let pendiente = false;

    const actualizar = () => {
      pendiente = false;
      const rect = v.getBoundingClientRect();
      const centro = window.innerHeight / 2;
      const recorrido = Math.max(1, rect.height - window.innerHeight);
      barra.style.transform = `scaleX(${Math.min(1, Math.max(0, -rect.top / recorrido))})`;
      document.body.classList.toggle("en-vitrina", rect.top <= 60 && rect.bottom > centro);

      // Activo: el panel que cruza el centro de la pantalla
      let i = paneles.findIndex((p) => {
        const r = p.getBoundingClientRect();
        return r.top <= centro && r.bottom > centro;
      });
      if (i < 0) i = rect.top > centro ? 0 : paneles.length - 1;
      if (i === actual) return;
      actual = i;
      v.style.setProperty("--color", colorDe(lista[i], i));
      document.body.style.setProperty("--color-vitrina", colorDe(lista[i], i));
      paneles.forEach((p, j) => p.classList.toggle("activo", j === i));
      puntos.forEach((b, j) => b.classList.toggle("activo", j === i));
    };

    alScroll = () => {
      if (!pendiente) { pendiente = true; requestAnimationFrame(actualizar); }
    };
    window.addEventListener("scroll", alScroll, { passive: true });
    window.addEventListener("resize", alScroll);
    document.body.style.setProperty("--color-vitrina", colorDe(lista[0], 0));
    actualizar();
  }

  function detenerVitrina() {
    document.body.classList.remove("en-vitrina");
    if (!alScroll) return;
    window.removeEventListener("scroll", alScroll);
    window.removeEventListener("resize", alScroll);
    alScroll = null;
  }

  function pintarGrilla() {
    const q = textoBusqueda.trim().toLowerCase();
    const lista = ordenados()
      .filter((p) => !filtroTag || (p.tags || []).includes(filtroTag))
      .filter((p) => !q || [p.titulo, p.resumen, ...(p.tags || [])].join(" ").toLowerCase().includes(q));

    const grilla = document.getElementById("grilla");
    if (!lista.length) {
      grilla.innerHTML = `<p class="vacio">No hay proyectos que coincidan.</p>`;
      return;
    }
    grilla.innerHTML = lista.map((p) => `
      <a class="tarjeta" href="#/proyecto/${encodeURIComponent(p.id)}">
        <div class="img">${p.portada ? `<img src="${esc(p.portada)}" alt="" loading="lazy">` : ""}</div>
        <div class="cuerpo">
          <div class="meta">
            ${p.fecha ? `<span>${esc(p.fecha)}</span>` : ""}
            ${p.estado ? `<span class="insignia">${esc(p.estado)}</span>` : ""}
            ${(p.videos || []).length ? `<span>▶ video</span>` : ""}
          </div>
          <h3>${esc(p.titulo)}</h3>
          <p>${fmt(p.resumen)}</p>
          <div class="tags">${tagsHtml(p.tags)}</div>
        </div>
      </a>`).join("");
  }

  function videoHtml(v) {
    const pie = v.titulo ? `<figcaption>${esc(v.titulo)}</figcaption>` : "";
    if (v.tipo === "youtube") {
      // YouTube bloquea embeds abiertos desde file://; en ese caso se muestra un enlace
      if (esArchivoLocal) {
        return `<div class="video"><figure>${pie}<a class="yt-link" href="https://www.youtube.com/watch?v=${esc(v.id)}" target="_blank" rel="noopener">▶ Ver en YouTube</a></figure></div>`;
      }
      return `<div class="video"><figure>${pie}<iframe src="https://www.youtube-nocookie.com/embed/${esc(v.id)}" title="${esc(v.titulo)}" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe></figure></div>`;
    }
    return `<div class="video"><figure>${pie}<video controls preload="metadata"${v.poster ? ` poster="${esc(v.poster)}"` : ""}><source src="${esc(v.src)}"></video></figure></div>`;
  }

  function vistaProyecto(id) {
    const p = proyectos.find((x) => x.id === id);
    if (!p) {
      app.innerHTML = `<a class="volver" href="#/">← Volver</a><p class="vacio">Proyecto no encontrado.</p>`;
      return;
    }
    document.title = `${p.titulo} · ${perfil.nombre || "Portafolio"}`;

    const secciones = [];
    if (p.descripcion) secciones.push(["descripcion", "Descripción", parrafos(p.descripcion)]);
    if ((p.videos || []).length) secciones.push(["videos", "Video", `<div class="videos">${p.videos.map(videoHtml).join("")}</div>`]);
    if ((p.comoFunciona || []).length) secciones.push(["funcionamiento", "Cómo funciona",
      `<ol class="pasos">${p.comoFunciona.map((s) => `<li><strong>${esc(s.titulo)}</strong><span>${fmt(s.texto)}</span></li>`).join("")}</ol>`]);
    if ((p.caracteristicas || []).length) secciones.push(["caracteristicas", "Características",
      `<ul class="lista">${p.caracteristicas.map((c) => `<li>${fmt(c)}</li>`).join("")}</ul>`]);
    if (p.arquitectura) secciones.push(["arquitectura", "Arquitectura", parrafos(p.arquitectura)]);
    if ((p.resultados || []).length) secciones.push(["resultados", "Resultados",
      `<div class="resultados">${p.resultados.map((r, i) => esPdf(r.src) ? `
        <figure class="pdf">
          ${r.titulo ? `<figcaption>${fmt(r.titulo)}</figcaption>` : ""}
          <object data="${esc(r.src)}#view=FitH" type="application/pdf">
            <p class="tabla-aviso">No se pudo mostrar el PDF. Revisá que exista el archivo <code>${esc(r.src)}</code>; si existe, abrilo con el botón de abajo.</p>
          </object>
          <div class="enlaces">
            <a class="boton" href="${esc(r.src)}" target="_blank" rel="noopener">Abrir en otra pestaña</a>
            <a class="boton" href="${esc(r.src)}" download>Descargar PDF</a>
          </div>
        </figure>` : esImagen(r.src) ? `
        <figure class="captura">
          ${r.titulo ? `<figcaption>${fmt(r.titulo)}</figcaption>` : ""}
          <button type="button" data-ri="${i}" aria-label="Ampliar imagen"><img src="${esc(r.src)}" alt="${esc(r.titulo)}" loading="lazy"></button>
        </figure>` : `
        <figure class="resultado" data-r="${i}">
          ${r.titulo ? `<figcaption>${fmt(r.titulo)}</figcaption>` : ""}
          <div class="resultado-cuerpo"><p class="tabla-aviso">Cargando resultados…</p></div>
          ${r.src ? `<a class="boton" href="${esc(r.src)}" download>Descargar Excel</a>` : ""}
        </figure>`).join("")}</div>`]);
    if ((p.imagenes || []).length) secciones.push(["capturas", "Capturas",
      `<div class="galeria">${p.imagenes.map((im, i) => `
        <figure class="captura">
          ${im.titulo ? `<figcaption>${fmt(im.titulo)}</figcaption>` : ""}
          <button type="button" data-i="${i}" aria-label="Ampliar imagen"><img src="${esc(im.src)}" alt="${esc(im.titulo)}" loading="lazy"></button>
        </figure>`).join("")}</div>`]);

    app.innerHTML = `
      <a class="volver" href="#/">← Todos los proyectos</a>
      <section class="cabecera">
        <div class="meta">
          ${p.fecha ? `<span>${esc(p.fecha)}</span>` : ""}
          ${p.estado ? `<span class="insignia">${esc(p.estado)}</span>` : ""}
        </div>
        <h1>${esc(p.titulo)}</h1>
        <p class="resumen">${fmt(p.resumen)}</p>
        <div class="enlaces">${botonesEnlace(p.enlaces, true)}</div>
      </section>
      <div class="detalle">
        <article>
          ${secciones.map(([sid, titulo, html]) => `<section class="seccion" id="s-${sid}"><h2>${titulo}</h2>${html}</section>`).join("")}
        </article>
        <aside class="lateral">
          <div class="caja">
            <h4>Tecnologías</h4>
            <div class="tags">${tagsHtml(p.tags)}</div>
          </div>
          ${secciones.length > 1 ? `<div class="caja indice"><h4>En esta página</h4>
            ${secciones.map(([sid, titulo]) => `<a href="#/proyecto/${encodeURIComponent(p.id)}" data-ir="s-${sid}">${titulo}</a>`).join("")}
          </div>` : ""}
        </aside>
      </div>`;

    // El índice no puede usar anclas porque el hash ya se usa para la navegación
    app.querySelectorAll("[data-ir]").forEach((a) => a.addEventListener("click", (e) => {
      e.preventDefault();
      document.getElementById(a.dataset.ir).scrollIntoView({ behavior: "smooth" });
    }));

    const lb = document.getElementById("lightbox");
    const ampliar = (im) => {
      lb.querySelector("img").src = im.src;
      lb.querySelector("p").textContent = im.titulo || "";
      lb.hidden = false;
    };
    app.querySelectorAll(".galeria button").forEach((b) => b.addEventListener("click", () => ampliar(p.imagenes[+b.dataset.i])));
    app.querySelectorAll("[data-ri]").forEach((b) => b.addEventListener("click", () => ampliar(p.resultados[+b.dataset.ri])));

    app.querySelectorAll(".resultado").forEach((fig) => iniciarResultado(fig, p.resultados[+fig.dataset.r]));
  }

  // Los .xlsx se convierten a .js con herramientas/excel_a_js.py: el navegador no puede leer el Excel desde file://
  const cargas = {};
  function cargarResultados(src) {
    if (window.RESULTADOS?.[src]) return Promise.resolve(window.RESULTADOS[src]);
    if (!cargas[src]) {
      cargas[src] = new Promise((ok, falla) => {
        const s = document.createElement("script");
        s.src = src.replace(/\.(xlsx|csv)$/i, ".js");
        s.onload = () => window.RESULTADOS?.[src] ? ok(window.RESULTADOS[src]) : falla();
        s.onerror = () => { delete cargas[src]; falla(); };
        document.head.appendChild(s);
      });
    }
    return cargas[src];
  }

  const nf0 = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });
  const nf2 = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 });
  const nfChico = new Intl.NumberFormat("es-AR", { maximumSignificantDigits: 3 });
  function numero(v) {
    if (typeof v !== "number") return esc(v ?? "");
    const a = Math.abs(v);
    if (Number.isInteger(v) || a >= 1000) return nf0.format(v);
    if (a > 0 && a < 1) return nfChico.format(v);
    return nf2.format(v);
  }

  function iniciarResultado(fig, r) {
    const cuerpo = fig.querySelector(".resultado-cuerpo");
    cargarResultados(r.src).then((datos) => {
      const hojas = (datos.hojas || []).filter((h) => h.filas.length);
      cuerpo.innerHTML = `
        ${hojas.length > 1 ? `<div class="filtros hojas">${hojas.map((h, i) =>
          `<button type="button" class="chip${i === 0 ? " activo" : ""}" data-h="${i}">${esc(h.nombre)}</button>`).join("")}</div>` : ""}
        <div class="hoja"></div>`;
      const cont = cuerpo.querySelector(".hoja");
      cuerpo.querySelectorAll("[data-h]").forEach((b) => b.addEventListener("click", () => {
        cuerpo.querySelectorAll("[data-h]").forEach((c) => c.classList.toggle("activo", c === b));
        pintarHoja(cont, hojas[+b.dataset.h], r);
      }));
      if (hojas.length) pintarHoja(cont, hojas[0], r);
    }).catch(() => {
      cuerpo.innerHTML = `<p class="tabla-aviso">No se encontraron los datos de este archivo. Ejecutá <code>python herramientas/excel_a_js.py</code> para generarlos.</p>`;
    });
  }

  function pintarHoja(cont, hoja, r) {
    if (!hoja.columnas) {
      // Hoja tipo "clave: valor" sin encabezado; las filas vacías separan grupos
      cont.innerHTML = `<div class="tabla-cont"><table class="tabla kv"><tbody>${hoja.filas.map((f) =>
        f.every((v) => v == null || v === "")
          ? `<tr class="sep"><td colspan="${f.length}"></td></tr>`
          : `<tr>${f.map((v) => `<td>${numero(v)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
      return;
    }

    const resaltar = (r.resaltar || []).map((x, i) => ({ ...x, clase: `res-${i % 3}` }));
    const claseFila = (f) => resaltar.find((x) => x.valor === f[0])?.clase || "";
    const conFiltro = hoja.filas.length > 60;

    cont.innerHTML = `
      ${resaltar.length || conFiltro ? `<div class="tabla-barra">
        ${conFiltro ? `<input class="buscar filtro-tabla" type="number" placeholder="Filtrar por ${esc(hoja.columnas[0])}…">` : ""}
        ${resaltar.map((x) => `<span class="leyenda ${x.clase}"><i></i>${esc(hoja.columnas[0])} = ${esc(x.valor)} · ${esc(x.etiqueta)}</span>`).join("")}
      </div>` : ""}
      <div class="tabla-cont">
        <table class="tabla">
          <thead><tr>${hoja.columnas.map((c) => `<th>${esc(c)}</th>`).join("")}</tr></thead>
          <tbody></tbody>
        </table>
      </div>
      <p class="tabla-pie"></p>`;

    const tbody = cont.querySelector("tbody");
    const pie = cont.querySelector(".tabla-pie");
    const pintar = (filtro) => {
      const filas = filtro === "" ? hoja.filas : hoja.filas.filter((f) => String(f[0]) === filtro);
      tbody.innerHTML = filas.map((f) => `<tr class="${claseFila(f)}">${f.map((v) => `<td>${numero(v)}</td>`).join("")}</tr>`).join("");
      pie.textContent = `${nf0.format(filas.length)} de ${nf0.format(hoja.filas.length)} filas`;
    };
    cont.querySelector(".filtro-tabla")?.addEventListener("input", (e) => pintar(e.target.value.trim()));
    pintar("");
  }

  function vistaSobreMi() {
    app.innerHTML = `
      <section class="sobre">
        <p class="rol" style="color:var(--acento);font-weight:600">${esc(perfil.rol)}</p>
        <h1>Sobre mí</h1>
        ${parrafos(perfil.sobreMi || perfil.bio)}
        ${perfil.ubicacion ? `<p style="color:var(--tenue)">${esc(perfil.ubicacion)}</p>` : ""}
        <div class="enlaces">${botonesEnlace(perfil.enlaces, true)}</div>
      </section>`;
  }

  function router() {
    const hash = location.hash.replace(/^#/, "") || "/";
    const partes = hash.split("/").filter(Boolean);
    document.title = perfil.nombre ? `${perfil.nombre} · Portafolio` : "Portafolio";
    document.querySelectorAll(".barra nav a").forEach((a) =>
      a.classList.toggle("activo", a.getAttribute("href") === "#" + (partes[0] === "sobre-mi" ? "/sobre-mi" : "/")));

    detenerVitrina();
    if (partes[0] === "proyecto" && partes[1]) vistaProyecto(decodeURIComponent(partes[1]));
    else if (partes[0] === "sobre-mi") vistaSobreMi();
    else vistaInicio();
    window.scrollTo(0, 0);
  }

  iniciarShell();
  window.addEventListener("hashchange", router);
  router();
})();
