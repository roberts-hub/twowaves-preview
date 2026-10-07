/* ============================================================
   GENERAR-PROPUESTAS.JS — páginas de propuesta por prospecto
   ------------------------------------------------------------
   Lee la pestaña "Propuestas" del Google Sheet "Prospectos TW" y,
   por cada fila con la casilla Publicar marcada y Estado vacío,
   "Pendiente", "Republicar" o "Error", genera:
     para/<slug>/index.html   (página a la medida, noindex)
     para/<slug>/toma-1.jpg…  (solo si hay OPENAI_API_KEY)

   Solo escribe dentro de para/. No toca contenido.js, las páginas
   de proyecto generadas, sitemap.xml ni nada más del sitio.

   Uso:
     node herramientas/generar-propuestas.js
         → lee el Sheet, genera páginas y deja el resultado en
           $RESULTADO (default /tmp/propuestas-resultado.json)
     node herramientas/generar-propuestas.js --marcar
         → después del push, escribe Estado/URL/Fecha en el Sheet
     node herramientas/generar-propuestas.js --json archivo.json
         → modo prueba: genera desde un JSON local, sin Sheet

   Variables de entorno (en GitHub: Settings › Secrets and variables › Actions):
     SHEET_ID                      id del Google Sheet
     GOOGLE_SERVICE_ACCOUNT_JSON   JSON de la cuenta de servicio (secreto)
     OPENAI_API_KEY                opcional; sin ella se usan referencias del portafolio
     IMAGE_MODEL                   opcional; default gpt-image-1
   ============================================================ */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const RAIZ = path.join(__dirname, "..");
const DOMINIO = "https://www.twowaves.mx";
const PESTANA = "Propuestas";
const RESULTADO = process.env.RESULTADO || "/tmp/propuestas-resultado.json";
const ESTADOS_A_PROCESAR = ["", "pendiente", "republicar", "error"];

// Columnas de la pestaña Propuestas (fila 1 = encabezados, datos desde la fila 2)
const COL = {
  fecha: 0, marca: 1, slug: 2, contacto: 3, etiqueta: 4, titular: 5, intro: 6, idea: 7,
  toma1: 8, toma2: 9, toma3: 10, entregables: 11, pasos: 12, casos: 13, video: 14,
  origen: 15, publicar: 16, estado: 17, url: 18, publicado: 19, notas: 20,
};
const LETRA = (i) => String.fromCharCode(65 + i);

global.window = {};
eval(fs.readFileSync(path.join(RAIZ, "contenido.js"), "utf8"));
const C = window.CONTENIDO;
const PROYECTOS = Object.fromEntries((C.proyectos || []).map((p) => [p.slug, p]));
const WHATSAPP = (C.contacto && C.contacto.whatsapp) || "523331290485";
const CORREO = (C.contacto && C.contacto.correo) || "info@twowaves.mx";

const esc = (t) => String(t == null ? "" : t)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const slugify = (t) => String(t || "").normalize("NFD").replace(/[̀-ͯ]/g, "")
  .toLowerCase().replace(/&/g, " y ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
const lineas = (t) => String(t || "").split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
const partes = (t) => String(t || "").split("|").map((s) => s.trim());
const absoluta = (r) => /^https?:\/\//.test(r || "") ? r : DOMINIO + "/" + String(r || "").replace(/^\//, "");

const ESTILO_IA = "Cinematic commercial film still, natural light, shot on a cinema camera with anamorphic lens, " +
  "subtle film grain, realistic, no text, no logos, no watermarks, 16:9 composition.";

/* ---------- Google Sheets (cuenta de servicio, sin dependencias) ---------- */

async function tokenGoogle() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("Falta GOOGLE_SERVICE_ACCOUNT_JSON");
  const cred = JSON.parse(raw);
  const ahora = Math.floor(Date.now() / 1000);
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const sinFirma = b64({ alg: "RS256", typ: "JWT" }) + "." + b64({
    iss: cred.client_email, scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token", iat: ahora, exp: ahora + 3600,
  });
  const firma = crypto.createSign("RSA-SHA256").update(sinFirma).sign(cred.private_key, "base64url");
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: sinFirma + "." + firma }),
  });
  const j = await r.json();
  if (!j.access_token) throw new Error("No se obtuvo token de Google: " + JSON.stringify(j));
  return j.access_token;
}

async function sheets(token, metodo, ruta, cuerpo) {
  const id = process.env.SHEET_ID;
  if (!id) throw new Error("Falta SHEET_ID");
  const r = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${id}/${ruta}`, {
    method: metodo, headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
  });
  const j = await r.json();
  if (j.error) throw new Error("Sheets: " + JSON.stringify(j.error));
  return j;
}

/* ---------- Imágenes con IA (opcional) ---------- */

async function generarImagen(prompt, destino) {
  const key = process.env.OPENAI_API_KEY;
  if (!key || !prompt) return false;
  const r = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.IMAGE_MODEL || "gpt-image-1",
      prompt: prompt + " " + ESTILO_IA, size: "1536x1024", n: 1,
      output_format: "jpeg", output_compression: 82,
    }),
  });
  const j = await r.json();
  const b64 = j && j.data && j.data[0] && j.data[0].b64_json;
  if (!b64) throw new Error("Imagen IA: " + JSON.stringify(j.error || j).slice(0, 300));
  fs.writeFileSync(destino, Buffer.from(b64, "base64"));
  return true;
}

/* ---------- Plantilla ---------- */

function pagina(d) {
  const casos = d.casos.map((s) => PROYECTOS[s]).filter(Boolean).slice(0, 3);
  const refs = casos.length ? casos : Object.values(PROYECTOS).slice(0, 3);
  const tomas = d.tomas.map((t, i) => ({
    ...t, img: t.imgLocal || (refs[i % refs.length] && refs[i % refs.length].miniatura) || "",
    etiqueta: t.imgLocal ? `Toma 0${i + 1} · Concepto` : `Toma 0${i + 1} · Ref.`,
  }));
  const hayIA = tomas.some((t) => t.imgLocal);
  const waTexto = encodeURIComponent(`Hola Roger, vi la propuesta para ${d.marca}`);
  const video = d.video ? `
    <a class="video" href="${esc(d.video)}" target="_blank" rel="noopener" style="background-image:url('${esc(tomas[0] && tomas[0].img)}')">
      <div class="play"><span class="btn">&#9654;</span><span><b>Roger te explica la idea</b><small>Ver video</small></span></div>
    </a>` : "";
  const bloque = (n, eti, h2, cuerpo) => `
  <section>
    <span class="mono">${n} · ${eti}</span>
    <h2>${h2}</h2>${cuerpo}
  </section>`;
  let n = 0; const num = () => String(++n).padStart(2, "0");

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow,noarchive">
<title>Para ${esc(d.marca)} · Two Waves</title>
<meta property="og:title" content="Para ${esc(d.marca)} · Two Waves">
<meta property="og:description" content="${esc(d.titular)}">
<meta property="og:image" content="${esc(absoluta(tomas[0] && tomas[0].img ? (tomas[0].imgLocal ? `para/${d.slug}/${tomas[0].imgLocal}` : tomas[0].img) : "assets/img/founders.jpg"))}">
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@300..900&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
:root{--fondo:#0e0e0d;--fondo-2:#151514;--texto:#e7e2d6;--suave:#bdb7aa;--acento:#b0a595;--linea:rgba(231,226,214,.12);--m:clamp(1.25rem,3.5vw,3.5rem);--r:clamp(.75rem,1.4vw,1.25rem)}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--fondo);color:var(--texto);font-family:Archivo,system-ui,sans-serif;font-size:17px;line-height:1.55;-webkit-font-smoothing:antialiased}
a{color:inherit}img{max-width:100%}
.wrap{max-width:1120px;margin:0 auto;padding:0 var(--m)}
.mono{font-family:"IBM Plex Mono",ui-monospace,monospace;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--acento)}
h1,h2,h3{font-weight:750;text-transform:uppercase;letter-spacing:-.03em;line-height:.95;text-wrap:balance}
h1{font-size:clamp(44px,8vw,104px)}h2{font-size:clamp(28px,4vw,44px);margin:12px 0 24px}h3{font-size:20px;letter-spacing:-.01em;line-height:1.1}
p.lead{font-size:clamp(19px,2vw,23px);max-width:720px;letter-spacing:-.01em}
.suave{color:var(--suave)}
section{padding:clamp(56px,9vw,112px) 0;border-top:1px solid var(--linea)}
nav{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:22px 0}
nav a{font-weight:800;letter-spacing:.02em;white-space:nowrap;text-decoration:none}nav .mono{text-align:right}
.hero{padding-top:clamp(40px,8vw,96px);border-top:0}.hero>.mono{display:block;margin-bottom:28px}.hero p.lead{margin-top:32px;color:#cfc9bc}
.video{display:block;text-decoration:none;margin-top:48px;position:relative;aspect-ratio:16/9;max-width:100%;border-radius:var(--r);overflow:hidden;background:#000 center/cover}
.video::after{content:"";position:absolute;inset:0;background:linear-gradient(0deg,rgba(0,0,0,.75),rgba(0,0,0,.15) 55%)}
.video .play{position:absolute;z-index:1;left:var(--m);bottom:var(--m);display:flex;gap:16px;align-items:center}
.video .btn{width:64px;height:64px;border-radius:50%;background:var(--texto);color:#000;display:grid;place-items:center;font-size:20px;flex:none}
.video small{display:block;color:#cfc9bc;font-size:14px}
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.frame{background:var(--fondo-2);border:1px solid var(--linea);border-radius:var(--r);overflow:hidden}
.frame .img{aspect-ratio:3/2;background:#1c1c1a center/cover;display:flex;align-items:flex-end;padding:14px}
.frame .img span{background:rgba(0,0,0,.6);padding:4px 8px;border-radius:4px}
.frame .t{padding:18px}.frame p{color:var(--suave);font-size:15px;margin-top:8px}
.two{display:grid;grid-template-columns:1fr 1fr;gap:clamp(24px,5vw,72px);align-items:start}
.two>*{min-width:0}
ul.list{list-style:none;border-top:1px solid var(--linea)}
ul.list li{padding:16px 0;border-bottom:1px solid var(--linea);display:flex;justify-content:space-between;gap:16px}
ul.list li span:last-child{color:var(--acento);font-family:"IBM Plex Mono",monospace;font-size:13px;text-align:right}
.step{padding:22px 0;border-bottom:1px solid var(--linea);display:grid;grid-template-columns:56px 1fr;gap:12px}
.step:first-child{border-top:1px solid var(--linea)}.step .n{font-family:"IBM Plex Mono",monospace;color:var(--acento)}
.step p{color:var(--suave);font-size:15px;margin-top:6px}
.case{display:block;text-decoration:none}.case .img{aspect-ratio:16/10;border-radius:var(--r);background:#1c1c1a center/cover;transition:transform .4s}
.case:hover .img{transform:scale(.98)}.case h3{margin-top:14px}.case .mono{display:block;margin-top:6px}
.founders{border-radius:var(--r);aspect-ratio:4/3;max-width:100%;background:#1c1c1a url("/assets/img/founders.jpg") center/cover}
.facts{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:32px}
.facts div{border-top:1px solid var(--linea);padding-top:14px}.facts b{display:block;font-size:26px;font-weight:750;letter-spacing:-.02em}
.btns{display:flex;flex-wrap:wrap;gap:12px;margin-top:36px}
.b{display:inline-flex;align-items:center;gap:10px;padding:16px 26px;border-radius:999px;text-decoration:none;font-weight:600}
.b.p{background:var(--texto);color:var(--fondo)}.b.s{border:1px solid var(--linea)}
.note{margin-top:20px;color:#8f8a7f;font-size:13px}
footer{padding:40px 0 56px;border-top:1px solid var(--linea);display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px}
a:focus-visible{outline:2px solid var(--texto);outline-offset:3px}
@media (max-width:820px){.grid3,.two,.facts{grid-template-columns:1fr}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
</style>
</head>
<body>
<div class="wrap">
  <nav><a href="${DOMINIO}/">TWO WAVES</a><span class="mono">Para ${esc(d.marca)} · ${esc(d.mes)}</span></nav>

  <section class="hero">
    <span class="mono">${esc(d.etiqueta || "Una idea para ustedes")}</span>
    <h1>${esc(d.titular)}</h1>
    <p class="lead">${esc(d.intro)}</p>${video}
  </section>
${tomas.length ? bloque(num(), "La idea", esc(d.ideaTitulo || "La idea"), `
    <p class="lead" style="margin-bottom:40px">${esc(d.idea)}</p>
    <div class="grid3">${tomas.map((t) => `
      <div class="frame"><div class="img" style="background-image:url('${esc(t.img)}')"><span class="mono">${t.etiqueta}</span></div><div class="t"><h3>${esc(t.titulo)}</h3><p>${esc(t.texto)}</p></div></div>`).join("")}
    </div>
    <p class="note">${hayIA ? "Imágenes conceptuales generadas con IA para ilustrar la idea. No son del lugar ni del rodaje final." : "Las imágenes son referencias de nuestro propio trabajo, no de su marca."}</p>`) : ""}
${d.entregables.length ? `
  <section><div class="two">
    <div><span class="mono">${num()} · Qué se llevan</span><h2>Una producción, varias piezas.</h2><p class="suave">Con los mismos días de rodaje sale todo lo que necesita la campaña.</p></div>
    <ul class="list">${d.entregables.map((e) => `<li><span>${esc(e[0])}</span><span>${esc(e[1] || "")}</span></li>`).join("")}</ul>
  </div></section>` : ""}
${d.pasos.length ? `
  <section><div class="two">
    <div><span class="mono">${num()} · Cómo lo haríamos</span><h2>Todo bajo el mismo techo.</h2><p class="suave">Hablas directo con quien lo dirige y con quien vuela el dron.</p></div>
    <div>${d.pasos.map((p, i) => `<div class="step"><span class="n">0${i + 1}</span><div><h3>${esc(p[0])}</h3><p>${esc(p[1] || "")}</p></div></div>`).join("")}</div>
  </div></section>` : ""}
${casos.length ? bloque(num(), "Trabajo parecido", "Lo que ya hicimos.", `
    <div class="grid3">${casos.map((c) => `
      <a class="case" href="${DOMINIO}/${esc(c.slug)}" target="_blank" rel="noopener"><div class="img" style="background-image:url('${esc(c.miniatura)}')"></div><h3>${esc(c.titulo)}</h3><span class="mono">${esc(c.cliente)} · ${esc(c.anio)}</span></a>`).join("")}
    </div>`) : ""}

  <section><div class="two">
    <div class="founders" role="img" aria-label="Roberto Arechederra y Rogelio Pérez"></div>
    <div>
      <span class="mono">${num()} · Quiénes somos</span>
      <h2>Two Waves.</h2>
      <p class="suave">Productora fundada en 2021 en Guadalajara por Roberto Arechederra (director) y Rogelio Pérez (piloto FPV y productor). Hacemos contenido comercial de la idea al máster final, en todo México y fuera.</p>
      <div class="facts"><div><b>2021</b><span class="mono">Desde</span></div><div><b>5.0</b><span class="mono">Google</span></div><div><b>MX + fuera</b><span class="mono">Producción</span></div></div>
    </div>
  </div></section>

  <section>
    <span class="mono">Siguiente paso</span>
    <h2>¿Lo platicamos 20 minutos?</h2>
    <p class="lead">Si les late, les cuento cómo lo resolveríamos y vemos fechas.</p>
    <div class="btns">
      <a class="b p" href="https://wa.me/${WHATSAPP}?text=${waTexto}">WhatsApp con Roger</a>
      <a class="b s" href="mailto:${CORREO}?subject=${encodeURIComponent("Propuesta " + d.marca)}">${CORREO}</a>
    </div>
  </section>

  <footer><span class="mono">Two Waves · Guadalajara, MX</span><a class="mono" href="${DOMINIO}/">twowaves.mx</a></footer>
</div>
</body>
</html>
`;
}

/* ---------- Fila del Sheet → datos de página ---------- */

function datosDeFila(f) {
  const marca = (f[COL.marca] || "").trim();
  const slug = slugify(f[COL.slug] || marca);
  const toma = (t) => { const [titulo, texto, prompt] = partes(t); return titulo ? { titulo, texto, prompt } : null; };
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const hoy = new Date();
  return {
    marca, slug,
    contacto: (f[COL.contacto] || "").trim(),
    etiqueta: (f[COL.etiqueta] || "").trim(),
    titular: (f[COL.titular] || "").trim(),
    intro: (f[COL.intro] || "").trim(),
    idea: (f[COL.idea] || "").trim(),
    tomas: [f[COL.toma1], f[COL.toma2], f[COL.toma3]].map(toma).filter(Boolean),
    entregables: lineas(f[COL.entregables]).map(partes),
    pasos: lineas(f[COL.pasos]).map(partes),
    casos: String(f[COL.casos] || "").split(/[,\s]+/).map((s) => s.trim().replace(/^https?:\/\/(www\.)?twowaves\.mx\//, "")).filter(Boolean),
    video: (f[COL.video] || "").trim(),
    mes: meses[hoy.getMonth()] + " " + hoy.getFullYear(),
  };
}

function validar(d) {
  const faltan = [];
  if (!d.marca) faltan.push("Marca");
  if (!d.slug) faltan.push("Slug");
  if (!d.titular) faltan.push("Titular");
  if (!d.intro) faltan.push("Intro");
  if (d.casos.some((s) => !PROYECTOS[s])) faltan.push("Casos inválidos: " + d.casos.filter((s) => !PROYECTOS[s]).join(", "));
  return faltan;
}

async function construir(d) {
  const dir = path.join(RAIZ, "para", d.slug);
  fs.mkdirSync(dir, { recursive: true });
  const avisos = [];
  for (let i = 0; i < d.tomas.length; i++) {
    const archivo = `toma-${i + 1}.jpg`;
    try {
      if (await generarImagen(d.tomas[i].prompt, path.join(dir, archivo))) d.tomas[i].imgLocal = archivo;
    } catch (e) { avisos.push(`Toma ${i + 1}: ${e.message}`); }
  }
  fs.writeFileSync(path.join(dir, "index.html"), pagina(d));
  return avisos;
}

/* ---------- Main ---------- */

async function main() {
  const args = process.argv.slice(2);

  if (args[0] === "--json") {
    const d = JSON.parse(fs.readFileSync(args[1], "utf8"));
    d.slug = slugify(d.slug || d.marca); d.mes = d.mes || "Oct 2026";
    d.tomas = d.tomas || []; d.entregables = d.entregables || []; d.pasos = d.pasos || []; d.casos = d.casos || [];
    const faltan = validar(d);
    if (faltan.length) throw new Error("Faltan datos: " + faltan.join(", "));
    const avisos = await construir(d);
    console.log(`Generada para/${d.slug}/index.html` + (avisos.length ? "\n" + avisos.join("\n") : ""));
    return;
  }

  const token = await tokenGoogle();

  if (args[0] === "--marcar") {
    if (!fs.existsSync(RESULTADO)) return console.log("Nada que marcar.");
    const res = JSON.parse(fs.readFileSync(RESULTADO, "utf8"));
    const data = res.map((r) => ({
      range: `${PESTANA}!${LETRA(COL.estado)}${r.fila}:${LETRA(COL.notas)}${r.fila}`,
      values: [[r.estado, r.url || "", r.estado === "Publicado" ? new Date().toISOString().slice(0, 16).replace("T", " ") : "", r.notas || ""]],
    }));
    if (data.length) await sheets(token, "POST", "values:batchUpdate", { valueInputOption: "RAW", data });
    console.log(`Marcadas ${data.length} filas en el Sheet.`);
    return;
  }

  const j = await sheets(token, "GET", `values/${encodeURIComponent(PESTANA + "!A2:U")}`);
  const filas = j.values || [];
  const resultado = [];
  for (let i = 0; i < filas.length; i++) {
    const f = filas[i];
    const marcada = String(f[COL.publicar] || "").toUpperCase() === "TRUE";
    const estado = String(f[COL.estado] || "").trim().toLowerCase();
    if (!marcada || !ESTADOS_A_PROCESAR.includes(estado)) continue;
    const fila = i + 2;
    const d = datosDeFila(f);
    const faltan = validar(d);
    if (faltan.length) { resultado.push({ fila, estado: "Error", notas: "Faltan datos: " + faltan.join(", ") }); continue; }
    try {
      const avisos = await construir(d);
      resultado.push({ fila, slug: d.slug, marca: d.marca, estado: "Publicado", url: `${DOMINIO}/para/${d.slug}/`, notas: avisos.join(" · ") });
      console.log(`Generada para/${d.slug}/`);
    } catch (e) {
      resultado.push({ fila, estado: "Error", notas: e.message.slice(0, 300) });
    }
  }
  fs.writeFileSync(RESULTADO, JSON.stringify(resultado, null, 2));
  const ok = resultado.filter((r) => r.estado === "Publicado").map((r) => r.marca);
  fs.writeFileSync("/tmp/propuestas-mensaje.txt", ok.length ? "Propuestas: " + ok.join(", ") : "");
  console.log(`${ok.length} páginas generadas, ${resultado.length - ok.length} con error.`);
}

main().catch((e) => { console.error(e.message); process.exit(1); });
