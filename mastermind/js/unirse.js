/* ═══════════════════════════════════════════════
   UNIRSE A LA LISTA — cuestionario paso a paso
   3 pasos (Nombre, Correo, WhatsApp) → FormSubmit
   (llega como correo). Si defines SHEETS_ENDPOINT,
   Google Sheets tiene prioridad.
   ═══════════════════════════════════════════════ */

(function () {
  // Destino de los datos
  const SHEETS_ENDPOINT = "https://script.google.com/macros/s/AKfycbxijC2mPQTwyDzI4JjLDKWn2CMetYRhndukj5h07FewL0GWOu-uclxbX-Rf5PUDKr_e/exec"; // Apps Script (/exec)
  const FORMSUBMIT_EMAIL = "roberto@arechederra.com"; // activado (verificable)
  const FORMSUBMIT_CC = "info@twowaves.mx";           // copia al correo del negocio

  const form = document.getElementById("form-unirse");
  const estado = document.getElementById("form-estado");
  const modal = document.getElementById("modal-gracias");
  const pasos = Array.from(form.querySelectorAll("[data-paso]"));
  const fill = form.querySelector(".flujo-fill");
  let actual = 0;

  // ── NAVEGACIÓN ENTRE PASOS ──
  function mostrar(i) {
    actual = i;
    pasos.forEach((p, n) => p.classList.toggle("activa", n === i));
    fill.style.width = ((i + 1) / pasos.length) * 100 + "%";
    const campo = pasos[i].querySelector("input, textarea, select");
    if (campo) setTimeout(() => campo.focus(), 60);
    estado.textContent = "";
  }

  function pasoValido(i) {
    const campos = pasos[i].querySelectorAll("input, textarea, select");
    for (const c of campos) {
      if (!c.checkValidity()) {
        c.reportValidity();
        c.classList.add("invalido");
        return false;
      }
      c.classList.remove("invalido");
    }
    return true;
  }

  function siguiente() {
    if (!pasoValido(actual)) return;
    if (actual < pasos.length - 1) mostrar(actual + 1);
  }
  function atras() {
    if (actual > 0) mostrar(actual - 1);
  }

  form.querySelectorAll("[data-siguiente]").forEach((b) => b.addEventListener("click", siguiente));
  form.querySelectorAll("[data-atras]").forEach((b) => b.addEventListener("click", atras));

  form.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    if (e.target.tagName === "TEXTAREA") return;
    e.preventDefault();
    if (actual === pasos.length - 1) form.requestSubmit();
    else siguiente();
  });

  mostrar(0);

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
    if (!pasoValido(actual) || !form.checkValidity()) {
      estado.textContent = "COMPLETA TODOS LOS CAMPOS";
      return;
    }

    const boton = pasos[pasos.length - 1].querySelector("button[type=submit]");
    boton.disabled = true;
    estado.textContent = "ENVIANDO…";

    // WhatsApp = lada + número, en un solo campo legible
    const lada = (form.querySelector("#lada") || {}).value || "";
    const cel = (form.querySelector("#celular") || {}).value || "";
    const whatsapp = ("(" + lada + ") " + cel).trim();

    try {
      // OPCIÓN A: Google Sheets vía Apps Script
      if (SHEETS_ENDPOINT) {
        const datos = new URLSearchParams(new FormData(form));
        datos.delete("lada");
        datos.delete("celular");
        datos.set("whatsapp", whatsapp);
        datos.append("fecha", new Date().toISOString());
        await fetch(SHEETS_ENDPOINT, { method: "POST", mode: "no-cors", body: datos });
        abrirGracias();
        return;
      }

      // OPCIÓN B: FormSubmit (llega por correo)
      const fd = new FormData(form);
      fd.delete("lada");
      fd.delete("celular");
      fd.set("whatsapp", whatsapp);
      fd.append("fecha", new Date().toISOString());
      fd.append("_subject", "Nueva solicitud a The Creator Masterclass");
      fd.append("_template", "table");
      fd.append("_captcha", "false");
      fd.append(
        "_autoresponse",
        "Hola, gracias por registrarte en la lista de espera de The Creator Masterclass de Two Waves Films. Recibimos tus datos correctamente. Cuando abramos el cupo te contactaremos con la fecha, la sede y los pasos para reservar tu lugar. Quedamos en contacto. Two Waves Films."
      );
      if (FORMSUBMIT_CC) fd.append("_cc", FORMSUBMIT_CC);

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
