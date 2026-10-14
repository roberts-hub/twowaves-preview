/* ═══════════════════════════════════════════════
   LISTA DE ESPERA — captura de leads
   (La intro / loader / reveals corren en js/main.js,
   idénticos a la página principal.)
   Envía nombre + correo + whatsapp → Google Sheets.
   Ver apps-script/lista.gs para activarlo.
   ═══════════════════════════════════════════════ */

(function () {
  // OPCIÓN A (recomendada para Google Sheets): pega aquí la URL del web app
  // de Apps Script (termina en /exec). Ver apps-script/lista.gs. Si está
  // puesta, tiene prioridad y los datos caen a tu hoja.
  const SHEETS_ENDPOINT = "";

  // OPCIÓN B (activa por default, sin cuenta): FormSubmit. Cada envío llega
  // como correo a esta dirección. Requiere confirmar UNA vez el primer envío
  // (FormSubmit manda un correo de activación con un botón "Activate Form").
  const FORMSUBMIT_EMAIL = "roberto@arechederra.com"; // ya activado (verificable)
  const FORMSUBMIT_CC = "info@twowaves.mx";           // copia al correo del negocio

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

  // ── POP-UP DE GRACIAS (logos rotando) ─────────
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

  // ── ENVÍO ─────────────────────────────────────
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!valido()) return;

    const boton = form.querySelector("button[type=submit]");
    boton.disabled = true;
    estado.textContent = "ENVIANDO…";

    try {
      // ── OPCIÓN A: Google Sheets vía Apps Script ──
      if (SHEETS_ENDPOINT) {
        const datos = new URLSearchParams(new FormData(form));
        datos.append("fecha", new Date().toISOString());
        await fetch(SHEETS_ENDPOINT, { method: "POST", mode: "no-cors", body: datos });
        abrirGracias();
        return;
      }

      // ── OPCIÓN B: FormSubmit (llega por correo, sin cuenta) ──
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
