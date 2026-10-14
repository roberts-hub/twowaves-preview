/* ═══════════════════════════════════════════════
   LISTA DE ESPERA — Two Waves Films
   Intro (loader) + reveal escalonado + captura de leads.
   Envía nombre + correo + whatsapp → FormSubmit (correo)
   o Google Sheets (si se define SHEETS_ENDPOINT).
   ═══════════════════════════════════════════════ */

(function () {
  // ── Destino de los datos ──
  // OPCIÓN A (prioritaria si se define): Google Sheets vía Apps Script (/exec)
  const SHEETS_ENDPOINT = "";
  // OPCIÓN B (default): FormSubmit. Llega como correo a este destino.
  const FORMSUBMIT_EMAIL = "roberto@arechederra.com"; // ya activado (verificable)
  const FORMSUBMIT_CC = "info@twowaves.mx";           // copia al correo del negocio

  // ── Revela el contenido con entrada escalonada ──
  function revelar() {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visto"));
  }

  /* ── PANTALLA DE CARGA (intro) ──
     fase 1: texto palabra por palabra → botón ENTRAR
     fase 2: logos rápidos sobre negro → entra el sitio */
  const loader = document.getElementById("loader");

  if (loader) {
    const intro = loader.querySelector(".loader-intro");
    const introBtn = document.getElementById("intro-btn");
    const glyphs = loader.querySelectorAll(".glyph");
    const PASO = 210;

    document.body.classList.add("cargando");

    const lineas = [...intro.querySelectorAll(".intro-linea")];
    lineas.forEach((linea) => {
      const palabras = linea.textContent.trim().split(/\s+/);
      linea.textContent = "";
      palabras.forEach((palabra, i) => {
        const span = document.createElement("span");
        span.className = "palabra";
        span.textContent = palabra;
        span.style.setProperty("--d", i * 0.09 + "s");
        linea.appendChild(span);
      });
    });

    let t = 300;
    lineas.forEach((linea, idx) => {
      const cascada = linea.children.length * 90 + 700;
      setTimeout(() => linea.classList.add("activa"), t);
      t += cascada - 250;
      if (idx === lineas.length - 1) {
        setTimeout(() => introBtn.classList.add("visible"), t + 600);
      }
    });

    const entrar = () => {
      intro.classList.add("fuera");
      loader.classList.add("fase-logos");
      glyphs.forEach((g, i) => {
        setTimeout(() => {
          glyphs.forEach((x) => x.classList.remove("activo"));
          g.classList.add("activo");
        }, 350 + i * PASO);
      });
      setTimeout(() => {
        loader.classList.add("fuera");
        document.body.classList.remove("cargando");
        revelar();
      }, 350 + glyphs.length * PASO + 420);
    };
    introBtn.addEventListener("click", entrar, { once: true });
  } else {
    // Sin loader: muestra el contenido de inmediato.
    revelar();
  }

  /* ═══════════════════════════════════════════════
     FORMULARIO DE CAPTURA
     ═══════════════════════════════════════════════ */
  const form = document.getElementById("form-lista");
  const estado = document.getElementById("form-estado");
  const modal = document.getElementById("modal-gracias");
  if (!form) return;

  function valido() {
    let ok = true;
    form.querySelectorAll("input[required]").forEach((c) => {
      if (!c.checkValidity()) {
        c.classList.add("invalido");
        if (ok) c.reportValidity();
        ok = false;
      } else {
        c.classList.remove("invalido");
      }
    });
    return ok;
  }

  form.querySelectorAll("input").forEach((c) =>
    c.addEventListener("input", () => c.classList.remove("invalido"))
  );

  // ── POP-UP DE GRACIAS (logos rotando) ──
  function abrirGracias() {
    const glyphs = modal.querySelectorAll(".glyph");
    let g = 0;
    const girar = () => {
      glyphs.forEach((x) => x.classList.remove("activo"));
      glyphs[g % glyphs.length].classList.add("activo");
      g++;
    };
    girar();
    setInterval(girar, 480);

    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add("abierto"));
    document.body.classList.add("cargando");
  }

  // ── ENVÍO ──
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!valido()) return;

    const boton = form.querySelector("button[type=submit]");
    boton.disabled = true;
    estado.textContent = "ENVIANDO…";

    try {
      // OPCIÓN A: Google Sheets vía Apps Script
      if (SHEETS_ENDPOINT) {
        const datos = new URLSearchParams(new FormData(form));
        datos.append("fecha", new Date().toISOString());
        await fetch(SHEETS_ENDPOINT, { method: "POST", mode: "no-cors", body: datos });
        abrirGracias();
        return;
      }

      // OPCIÓN B: FormSubmit (llega por correo, sin cuenta)
      const fd = new FormData(form);
      fd.append("fecha", new Date().toISOString());
      fd.append("_subject", "Nuevo interesado — Lista de espera (Two Waves)");
      fd.append("_template", "table");
      fd.append("_captcha", "false");
      if (typeof FORMSUBMIT_CC === "string" && FORMSUBMIT_CC) fd.append("_cc", FORMSUBMIT_CC);

      const resp = await fetch("https://formsubmit.co/ajax/" + FORMSUBMIT_EMAIL, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: fd,
      });
      if (!resp.ok) throw new Error("http " + resp.status);

      abrirGracias();
    } catch {
      estado.textContent = "ERROR AL ENVIAR — INTENTA DE NUEVO";
      boton.disabled = false;
    }
  });
})();
