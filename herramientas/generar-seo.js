/* ============================================================
   GENERAR-SEO.JS — páginas individuales de proyectos + sitemap
   ------------------------------------------------------------
   Lee contenido.js y genera en la raíz del repo:
     · una página estática por proyecto (<slug>.html) con su
       reproductor, descripción, Open Graph y datos estructurados
       (VideoObject + BreadcrumbList) para Google
     · sitemap.xml con TODAS las URLs del sitio

   Correr después de agregar/quitar proyectos o cambiar textos:
     node herramientas/generar-seo.js
   ============================================================ */

const fs = require("fs");
const path = require("path");

const RAIZ = path.join(__dirname, "..");
const DOMINIO = "https://www.twowaves.mx";

global.window = {};
eval(fs.readFileSync(path.join(RAIZ, "contenido.js"), "utf8"));
const C = window.CONTENIDO;

const esc = (t) => String(t || "")
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");

const absoluta = (ruta) => /^https?:\/\//.test(ruta) ? ruta : DOMINIO + "/" + ruta.replace(/^\//, "");

function paginaProyecto(p) {
  const url = DOMINIO + "/" + p.slug;
  const miniatura = absoluta(p.miniatura);
  const [aw, ah] = ((p.video && p.video.aspecto) || "16x9").split(/[x:]/).map(Number);
  const ar = aw && ah ? (aw / ah).toFixed(4) : "1.7778";
  const vimeoId = p.video && p.video.tipo === "vimeo" ? p.video.id : null;
  const embed = vimeoId
    ? "https://player.vimeo.com/video/" + vimeoId + "?autoplay=1&title=0&byline=0&portrait=0"
    : null;
  const titulo = esc(p.titulo);
  const desc = esc(p.descripcion || (p.titulo + " by Two Waves, production company in Guadalajara, México."));

  const jsonVideo = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: p.titulo + " — " + p.cliente,
    description: p.descripcion || "",
    thumbnailUrl: [miniatura],
    uploadDate: (p.anio || "2024") + "-01-01",
    embedUrl: vimeoId ? "https://player.vimeo.com/video/" + vimeoId : undefined,
    publisher: { "@type": "Organization", name: "Two Waves Films", url: DOMINIO },
  });

  const jsonMigas = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: DOMINIO + "/" },
      { "@type": "ListItem", position: 2, name: "Work", item: DOMINIO + "/work" },
      { "@type": "ListItem", position: 3, name: p.titulo, item: url },
    ],
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#0b0b0a">
  <title>${titulo} — ${esc(p.cliente)} | TWO WAVES</title>
  <meta name="description" content="${desc}">
  <meta property="og:title" content="${titulo} — ${esc(p.cliente)} | TWO WAVES">
  <meta property="og:description" content="${desc}">
  <meta property="og:type" content="video.other">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${esc(miniatura)}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="/favicon.ico" sizes="32x32">
  <link rel="icon" type="image/svg+xml" href="/assets/img/favicon.svg">
  <link rel="icon" type="image/png" sizes="96x96" href="/assets/img/favicon-96x96.png">
  <link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
  <link rel="canonical" href="${url}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://player.vimeo.com">
  <link rel="preconnect" href="https://i.vimeocdn.com">
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@300..900&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/estilo.css?v=93">
  <script type="application/ld+json">${jsonVideo}</script>
  <script type="application/ld+json">${jsonMigas}</script>
</head>
<body>

  <a class="saltar-contenido" href="#contenido">Skip to content</a>

  <header class="nav">
    <a href="/" class="nav_logo"><span data-marca>—</span></a>
    <nav class="nav_links" aria-label="Main navigation">
      <a class="nav_link" href="/">Home</a>
      <a class="nav_link" href="/work">Work</a>
      <a class="nav_link" href="/about">About</a>
      <span class="nav_borde"></span>
    </nav>
    <a class="nav_cta boton" href="/contact">Get in touch</a>
    <button class="nav_hamburguesa" aria-label="Open menu"><i></i><i></i><i></i></button>
  </header>

  <div class="menu-movil">
    <a href="/"><span>Home</span></a>
    <a href="/work"><span>Work</span></a>
    <a href="/about"><span>About</span></a>
    <a href="/contact"><span>Contact</span></a>
  </div>

  <main id="contenido">
    <article class="seccion pagina-proyecto" data-tema="profundo">
      <div class="bloque pagina-proyecto_bloque">
        <nav class="pagina-proyecto_migas" aria-label="Breadcrumb">
          <a href="/work">← All work</a>
        </nav>
        <h1 class="pagina-proyecto_titulo">${titulo}</h1>
        <div class="pagina-proyecto_metas">
          <span class="etiqueta">${esc(p.cliente)}</span>
          <span class="etiqueta">${esc(p.categoria || "")}</span>
          <span class="etiqueta">${esc(p.anio || "")}</span>
        </div>

        <div class="pagina-proyecto_player" style="aspect-ratio: ${ar};" data-player>
          <img src="${esc(p.miniatura)}" alt="${titulo} — ${esc(p.cliente)}" fetchpriority="high" decoding="async"${p.posicion ? ` style="object-position: ${esc(p.posicion)};"` : ""}>
          <button class="pagina-proyecto_play" type="button" aria-label="Play ${titulo}">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>
            <span>Play film</span>
          </button>
        </div>

        <p class="parrafo pagina-proyecto_descripcion">${desc}</p>

        <div class="pagina-proyecto_cta">
          <a class="boton" href="/contact">Start your project</a>
          <a class="boton-mas" href="/work">See all work
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </a>
        </div>
      </div>
    </article>
  </main>

  <footer class="pie seccion" data-tema="profundo">
    <div class="pie_superior">
      <div class="pie_columna">
        <span class="pie_titulo">Social</span>
        <a data-red="instagram" href="#" target="_blank" rel="noopener">Instagram</a>
        <a data-red="vimeo" href="#" target="_blank" rel="noopener">Vimeo</a>
      </div>
      <div class="pie_columna">
        <span class="pie_titulo">Contact</span>
        <a data-correo href="#" data-texto="contacto.correo"></a>
        <a data-telefono href="#"></a>
        <span class="pie_nota" data-texto="contacto.direccion"></span>
      </div>
    </div>
    <div class="pie_legal">
      <span>© <span data-anio></span> <span data-marca></span>. All rights reserved.</span>
      <span data-texto="marca.ciudad"></span>
    </div>
  </footer>

  <script>
    // Reproductor con fachada: la página carga ligera (solo la miniatura)
    // y el iframe de Vimeo se inyecta hasta que el visitante da Play.
    (function () {
      var caja = document.querySelector("[data-player]");
      if (!caja) return;
      caja.addEventListener("click", function () {
        if (caja.dataset.activo) return;
        caja.dataset.activo = "1";
        ${embed ? `var f = document.createElement("iframe");
        f.src = ${JSON.stringify(embed)};
        f.allow = "autoplay; fullscreen; picture-in-picture";
        f.allowFullscreen = true;
        f.title = ${JSON.stringify(p.titulo)};
        caja.innerHTML = "";
        caja.appendChild(f);` : ""}
      });
    })();
  </script>
  <!-- GSAP + ScrollTrigger + Flip + Lenis en UNA sola peticion (menos viajes de red) -->
  <script src="https://cdn.jsdelivr.net/combine/npm/gsap@3.12.5/dist/gsap.min.js,npm/gsap@3.12.5/dist/ScrollTrigger.min.js,npm/gsap@3.12.5/dist/Flip.min.js,npm/lenis@1.1.14/dist/lenis.min.js"></script>
  <script src="/contenido.js?v=93"></script>
  <script src="/js/app.js?v=93"></script>
</body>
</html>
`;
}

/* --- Generar páginas --- */
let generadas = 0;
C.proyectos.forEach((p) => {
  if (!p.slug) { console.warn("SIN SLUG (saltado):", p.titulo); return; }
  fs.writeFileSync(path.join(RAIZ, p.slug + ".html"), paginaProyecto(p));
  generadas++;
});

/* --- Sitemap con todas las URLs --- */
const hoy = new Date().toISOString().slice(0, 10);
const urls = [
  { loc: DOMINIO + "/", prioridad: "1.0", freq: "monthly" },
  { loc: DOMINIO + "/work", prioridad: "0.9", freq: "monthly" },
  { loc: DOMINIO + "/about", prioridad: "0.7", freq: "yearly" },
  { loc: DOMINIO + "/contact", prioridad: "0.7", freq: "yearly" },
  ...C.proyectos.filter((p) => p.slug).map((p) => ({
    loc: DOMINIO + "/" + p.slug, prioridad: "0.8", freq: "yearly",
  })),
];
const sitemap =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map((u) =>
    `  <url><loc>${u.loc}</loc><lastmod>${hoy}</lastmod><changefreq>${u.freq}</changefreq><priority>${u.prioridad}</priority></url>`
  ).join("\n") +
  "\n</urlset>\n";
fs.writeFileSync(path.join(RAIZ, "sitemap.xml"), sitemap);

console.log("Páginas de proyecto generadas:", generadas);
console.log("sitemap.xml:", urls.length, "URLs");
