/* ============================================================
   APP.JS — Motor del sitio
   ------------------------------------------------------------
   No necesitas editar este archivo para cambiar contenido:
   todo el contenido vive en contenido.js.
   ============================================================ */

(function () {
  "use strict";
  const C = window.CONTENIDO;
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ==========================================================
     1. RENDERIZADO DE CONTENIDO desde contenido.js
     ========================================================== */

  // Precarga: se mantiene hasta que el video del hero YA reproduce
  // (mínimo 2.4s, tope 5.6s). Así nunca se ve el thumbnail estático.
  const estadoHero = { listo: false, avisar: () => {} };
  const precarga = $(".precarga");
  if (precarga) {
    // En páginas con video de header (Home, About) la precarga sale
    // SIEMPRE: cubre la carga del video incluso en refresh. En las demás,
    // solo la primera visita de la sesión.
    const paginaConVideo = !!($(".hero_fondo") || $("[data-video-hero]"));
    const yaVista = !!sessionStorage.getItem("intro-vista");
    if (!paginaConVideo && yaVista) {
      precarga.remove();
    } else {
      // Si la intro ya se vio en esta sesión, no repetimos la T: queda un
      // velo negro sin logo que se suelta apenas el video ya reproduce.
      const rapida = paginaConVideo && yaVista;
      if (rapida) precarga.classList.add("precarga--rapida");
      const MINIMO = rapida ? 0 : 2400;   // tiempo mínimo en pantalla
      const COLCHON = rapida ? 150 : 700; // margen tras confirmar reproducción
      const TOPE = rapida ? 2600 : 5600;  // tope duro
      let quitada = false;
      const quitar = () => {
        if (quitada) return;
        quitada = true;
        precarga.classList.add("fuera");
        sessionStorage.setItem("intro-vista", "1");
        setTimeout(() => precarga.remove(), 1500);
      };
      const inicio = performance.now();
      const intentar = () => {
        // El margen extra tras confirmar reproducción evita que el
        // poster del video se asome antes del fundido
        if (estadoHero.listo && performance.now() - inicio >= MINIMO) setTimeout(quitar, COLCHON);
      };
      estadoHero.avisar = intentar;
      setTimeout(intentar, MINIMO + 50);
      setTimeout(quitar, TOPE);
    }
  }

  // Al volver a la página (caché de retroceso del navegador) o al
  // re-enfocar la pestaña, los players de Vimeo quedan congelados:
  // se les reenvía play para que el video inicial nunca se vea trabado.
  function reanudarPlayers() {
    $$(".hero_fondo iframe, .tarjeta--grande .tarjeta_visual iframe, .video-hero iframe").forEach((f) => {
      if (f.contentWindow) f.contentWindow.postMessage(JSON.stringify({ method: "play" }), "*");
    });
  }
  window.addEventListener("pageshow", (e) => { if (e.persisted) reanudarPlayers(); });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") reanudarPlayers();
  });

  // Marca (logo, título de pestaña, pie)
  $$("[data-marca]").forEach((el) => (el.textContent = C.marca.nombre));
  document.title = document.title.replace("{{marca}}", C.marca.nombre);

  // Textos sueltos: <span data-texto="portada.subtitulo"></span>
  $$("[data-texto]").forEach((el) => {
    const valor = el.dataset.texto.split(".").reduce((o, k) => (o ? o[k] : ""), C);
    if (valor) {
      // Un salto de línea (\n) en contenido.js parte el texto en dos líneas
      if (typeof valor === "string" && valor.includes("\n")) {
        el.innerHTML = valor
          .split("\n")
          .map((t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"))
          .join("<br>");
      } else {
        el.textContent = valor;
      }
    }
  });

  // Año dinámico
  $$("[data-anio]").forEach((el) => (el.textContent = new Date().getFullYear()));

  // Widget de WhatsApp: visible solo si hay número en contenido.js.
  // Aparece tras 60 s acumulados de navegación (cuenta entre páginas,
  // solo mientras la pestaña está visible) con mensaje prellenado.
  $$("[data-whatsapp]").forEach((el) => {
    const num = (C.contacto.whatsapp || "").replace(/[^\d]/g, "");
    if (!num) { el.style.display = "none"; return; }
    const msj = C.contacto.whatsappMensaje || "";
    el.href = "https://wa.me/" + num + (msj ? "?text=" + encodeURIComponent(msj) : "");

    const ESPERA = 60; // segundos de navegación antes de mostrarlo
    const CLAVE = "tw_nav_segundos";
    let acumulado = parseInt(sessionStorage.getItem(CLAVE) || "0", 10);
    if (acumulado >= ESPERA) { el.classList.add("whatsapp--visible"); return; }
    const reloj = setInterval(() => {
      if (document.hidden) return;
      acumulado += 1;
      sessionStorage.setItem(CLAVE, String(acumulado));
      if (acumulado >= ESPERA) {
        clearInterval(reloj);
        el.classList.add("whatsapp--visible");
      }
    }, 1000);
  });

  // Teléfono de contacto: visible solo si está definido en contenido.js
  $$("[data-telefono]").forEach((el) => {
    const tel = (C.contacto.telefono || "").trim();
    if (tel) {
      // Si el enlace trae icono, el número va en su span interno
      (el.querySelector("[data-telefono-texto]") || el).textContent = tel;
      el.href = "tel:" + tel.replace(/[^+\d]/g, "");
    } else {
      el.style.display = "none";
    }
  });

  // Correo (mailto), redes sociales y lista de servicios
  $$("[data-correo]").forEach((el) => (el.href = "mailto:" + C.contacto.correo));
  $$("[data-red]").forEach((el) => {
    const url = C.contacto[el.dataset.red];
    if (url) el.href = url;
    else el.style.display = "none";
  });
  const listaServicios = $("[data-servicios]");
  if (listaServicios) {
    listaServicios.innerHTML = C.nosotros.servicios.map((s) => "<li>" + s + "</li>").join("");
  }

  // Proceso de trabajo (About): 3 fases desde contenido.js
  const contProceso = $("[data-proceso]");
  if (contProceso && C.nosotros.proceso) {
    contProceso.innerHTML = C.nosotros.proceso
      .map(
        (f) =>
          '<div class="proceso_fase" data-revelar>' +
          '<span class="proceso_numero acento-serif">' + f.paso + "</span>" +
          '<h3 class="proceso_titulo">' + f.titulo + "</h3>" +
          '<p class="proceso_texto">' + f.texto + "</p></div>"
      )
      .join("");
  }

  // Fundadores (About): foto + texto desde contenido.js
  const contFundadores = $("[data-fundadores]");
  if (contFundadores && C.fundadores) {
    const f = C.fundadores;
    const nombres = (f.nombres || [])
      .map(
        (n) =>
          '<a class="fundadores_nombre"' +
          (n.instagram ? ' href="' + n.instagram + '" target="_blank" rel="noopener"' : "") +
          '><span class="fundadores_nombre_txt">' + n.nombre +
          '</span><span class="etiqueta">' + n.rol + "</span>" +
          (n.usuario ? '<span class="fundadores_ig">' + n.usuario + ' ↗</span>' : "") +
          "</a>"
      )
      .join("");
    const parrafosF = (f.parrafos || (f.texto ? [f.texto] : []))
      .map((p) => '<p class="parrafo" data-revelar>' + p + "</p>")
      .join("");
    contFundadores.innerHTML =
      '<figure class="fundadores_foto" data-revelar><img src="' + f.foto +
      '" alt="' + (f.etiqueta || "Founders") + '" loading="lazy" decoding="async"></figure>' +
      '<div class="fundadores_texto">' +
      '<span class="etiqueta" data-revelar>' + f.etiqueta + "</span>" +
      '<h2 class="titulo-seccion" data-revelar>' + f.titulo + "</h2>" +
      parrafosF +
      (nombres ? '<div class="fundadores_nombres" data-revelar>' + nombres + "</div>" : "") +
      "</div>";
  }

  // Why Two Waves (About): 2 columnas + frase destacada
  const contPorque = $("[data-porque]");
  if (contPorque && C.porque) {
    contPorque.innerHTML =
      '<h2 class="titulo-seccion" data-revelar>' + C.porque.titulo + "</h2>" +
      '<div class="porque_columnas">' +
      C.porque.parrafos
        .map((p) => '<p class="parrafo" data-revelar>' + p + "</p>")
        .join("") +
      "</div>" +
      (C.porque.destacado
        ? '<p class="porque_destacado" data-revelar>' + C.porque.destacado + "</p>"
        : "");
  }

  // Headers secundarios con video de fondo (ej. About con Grand Island):
  // <section data-video-hero="ID|WxH|inicio"> — en play desde que entras
  $$("[data-video-hero]").forEach((sec) => {
    if (reducirMovimiento || !window.matchMedia("(min-width: 700px)").matches) return;
    const [id, aspecto, inicioStr] = sec.dataset.videoHero.split("|");
    const inicio = parseFloat(inicioStr) || 1;
    const [aw, ah] = (aspecto || "16x9").split(/[x:]/).map(Number);
    const ar = aw && ah ? aw / ah : 16 / 9;
    const iframe = document.createElement("iframe");
    iframe.src =
      "https://player.vimeo.com/video/" + id +
      "?background=1&autoplay=1&muted=1&loop=1&autopause=0&playsinline=1&dnt=1" +
      "#t=" + inicio + "s";
    iframe.allow = "autoplay";
    iframe.tabIndex = -1;
    iframe.setAttribute("aria-hidden", "true");
    iframe.style.cssText =
      "position:absolute;top:50%;left:50%;" +
      "transform:translate(-50%,-50%) scale(1.04);" +
      "aspect-ratio:" + ar + ";min-width:100.5%;min-height:100.5%;" +
      "width:auto;height:auto;border:0;pointer-events:none;" +
      "opacity:0;transition:opacity 0.8s ease;";
    const alMsj = (ev) => {
      if (ev.source !== iframe.contentWindow) return;
      let d; try { d = JSON.parse(ev.data); } catch (_) { return; }
      if (d.event === "playProgress" || d.event === "timeupdate") {
        iframe.style.opacity = "1";
        window.removeEventListener("message", alMsj);
      }
    };
    window.addEventListener("message", alMsj);
    iframe.addEventListener("load", () => {
      iframe.contentWindow.postMessage(JSON.stringify({ method: "addEventListener", value: "playProgress" }), "*");
      setTimeout(() => { if (document.visibilityState === "visible") iframe.style.opacity = "1"; }, 3500);
    });
    $(".video-hero_fondo", sec).appendChild(iframe);
  });

  // Formulario de contacto: en Netlify el POST llega solo; en local o en
  // otro hosting, abre el correo del visitante ya prellenado (mailto).
  const formulario = $("[data-formulario]");
  const modalGracias = $(".modal-gracias");
  function mostrarGracias() {
    if (!modalGracias) return;
    modalGracias.showModal();
    if (window.lenis) window.lenis.stop();
  }
  if (modalGracias) {
    const cerrar = () => {
      modalGracias.close();
      if (window.lenis) window.lenis.start();
    };
    modalGracias.addEventListener("cancel", (e) => { e.preventDefault(); cerrar(); });
    modalGracias.addEventListener("click", (e) => {
      if (e.target === modalGracias || e.target.closest("[data-cerrar-gracias]")) cerrar();
    });
  }
  if (formulario) {
    // Los mensajes llegan directo al correo (contacto.correoFormulario)
    // vía FormSubmit, con formato de tabla. El visitante nunca sale del sitio.
    formulario.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!formulario.reportValidity()) return;
      const boton = formulario.querySelector("[type=submit]");
      const d = new FormData(formulario);
      const destino = C.contacto.correoFormulario || C.contacto.correo;
      boton.disabled = true;
      boton.textContent = "Sending…";
      try {
        const resp = await fetch("https://formsubmit.co/ajax/" + destino, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            Name: d.get("nombre"),
            Email: d.get("correo"),
            Phone: d.get("telefono"),
            Message: d.get("mensaje"),
            _subject: "Project inquiry — " + d.get("nombre"),
            _template: "table",
            _captcha: "false",
            _replyto: d.get("correo"),
          }),
        });
        if (!resp.ok) throw new Error("respuesta " + resp.status);
        formulario.reset();
        mostrarGracias();
      } catch (err) {
        // Respaldo: si el servicio falla, se abre la app de correo
        const cuerpo =
          "Name: " + d.get("nombre") +
          "\nEmail: " + d.get("correo") +
          "\nPhone: " + d.get("telefono") +
          "\n\n" + d.get("mensaje");
        location.href =
          "mailto:" + destino +
          "?subject=" + encodeURIComponent("Project inquiry — " + d.get("nombre")) +
          "&body=" + encodeURIComponent(cuerpo);
      } finally {
        boton.disabled = false;
        boton.textContent = "Send";
      }
    });
  }

  // Hero de portada: poster inmediato + video después (optimizado)
  const heroFondo = $("[data-hero-fondo]");
  if (heroFondo) {
    const img = document.createElement("img");
    img.src = C.portada.imagenFondo;
    img.alt = "";
    img.fetchPriority = "high";
    heroFondo.prepend(img);

    const fondo = C.portada.videoFondo;
    // En pantallas chicas (celular) no se descarga el video de fondo:
    // se queda el poster. Ahorra datos y acelera la carga móvil.
    const pantallaConVideo = window.matchMedia("(min-width: 700px)").matches;
    if (!(fondo && !reducirMovimiento && pantallaConVideo)) {
      // Sin video de fondo: la precarga no espera nada
      estadoHero.listo = true;
      estadoHero.avisar();
    }
    if (fondo && !reducirMovimiento && pantallaConVideo) {
      // Se inyecta DE INMEDIATO para que cargue durante la precarga
      const inyectarVideo = () => {
        if (typeof fondo === "object" && fondo.tipo === "vimeo") {
          // Player de Vimeo en modo fondo: autoplay silencioso, loop, sin controles
          const [w, h] = (fondo.aspecto || "16x9").split(/[x:]/).map(Number);
          const ar = w && h ? w / h : 16 / 9;
          const iframe = document.createElement("iframe");
          iframe.src =
            "https://player.vimeo.com/video/" + fondo.id +
            "?background=1&autoplay=1&muted=1&loop=1&autopause=0&playsinline=1&dnt=1";
          iframe.allow = "autoplay; fullscreen";
          iframe.title = "";
          iframe.setAttribute("aria-hidden", "true");
          iframe.tabIndex = -1;
          // Recorte tipo "cover": el iframe siempre sobra por un lado
          iframe.style.cssText =
            "position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);" +
            "width:max(100vw, calc(100svh * " + ar + "));" +
            "height:max(100svh, calc(100vw / " + ar + "));" +
            "border:0;pointer-events:none;opacity:0;transition:opacity 1s ease;";
          // Aparece (y libera la precarga) cuando YA está reproduciendo
          const alMensajeHero = (ev) => {
            if (ev.source !== iframe.contentWindow) return;
            let dd; try { dd = JSON.parse(ev.data); } catch (_) { return; }
            if (dd.event === "playProgress" || dd.event === "timeupdate") {
              iframe.style.opacity = "1";
              estadoHero.listo = true;
              estadoHero.avisar();
              window.removeEventListener("message", alMensajeHero);
            }
          };
          window.addEventListener("message", alMensajeHero);
          iframe.addEventListener("load", () => {
            iframe.contentWindow.postMessage(JSON.stringify({ method: "addEventListener", value: "playProgress" }), "*");
            // Respaldo: si los eventos no llegan, revela a los 4s visibles
            setTimeout(() => {
              if (document.visibilityState === "visible") iframe.style.opacity = "1";
              estadoHero.listo = true;
              estadoHero.avisar();
            }, 4000);
          });
          heroFondo.append(iframe);
        } else if (typeof fondo === "string" && fondo) {
          const vid = document.createElement("video");
          Object.assign(vid, { src: fondo, muted: true, loop: true, playsInline: true, autoplay: true });
          vid.setAttribute("muted", "");
          vid.setAttribute("playsinline", "");
          heroFondo.append(vid);
          vid.addEventListener("playing", () => { estadoHero.listo = true; estadoHero.avisar(); }, { once: true });
          vid.play().catch(() => {});
        }
      };
      inyectarVideo(); // sin esperar 'load': carga durante la precarga
      // Al volver desde otra página (bfcache) el player queda congelado y
      // el "play" no siempre lo revive: se reconstruye desde cero.
      window.addEventListener("pageshow", (e) => {
        if (e.persisted) {
          heroFondo.querySelectorAll("iframe, video").forEach((x) => x.remove());
          inyectarVideo();
        }
      });
    }
  }

  // Título del hero (3 líneas configurables)
  const heroTitulo = $("[data-hero-titulo]");
  if (heroTitulo) {
    const lineas = [
      [C.portada.tituloLinea1, ""],
      [C.portada.tituloAcento, "acento-serif"],
      [C.portada.tituloLinea2, ""],
    ].filter(([t]) => t); // ignora líneas vacías
    heroTitulo.innerHTML = lineas
      .map(([t, cls]) => '<span class="hero_linea"><span class="' + cls + '">' + t + "</span></span>")
      .join("");
  }

  // Banda de clientes: grid de logos blancos (como la referencia).
  // Solo aparecen los clientes con archivo de logo; si ninguno lo
  // tiene todavía, se muestran los nombres en texto como respaldo.
  const contClientes = $("[data-clientes]");
  if (contClientes) {
    const lista = C.clientes.map((c) => (typeof c === "string" ? { nombre: c, logo: "" } : c));
    const conLogo = lista.filter((c) => c.logo);
    let items, claseExtra;
    if (conLogo.length) {
      // Slider horizontal de logos: se desliza continuo de derecha a izquierda
      claseExtra = " marquesina--logos";
      // Carga inmediata (no lazy): dentro de una pista animada el
      // navegador nunca dispara la carga diferida.
      items = conLogo
        .map(
          (c) =>
            '<img class="marquesina_logo" src="' + c.logo + '" alt="' + c.nombre +
            '" data-escala="' + (c.escala || 1) + '" onerror="this.remove()">'
        )
        .join("");
    } else {
      claseExtra = "";
      items = lista
        .map((c) => '<span class="marquesina_item">' + c.nombre + "</span>")
        .join("");
    }
    // Pista duplicada para que el loop sea continuo y sin saltos
    contClientes.innerHTML =
      '<div class="marquesina' + claseExtra + '"><div class="marquesina_pista">' + items + "</div>" +
      '<div class="marquesina_pista" aria-hidden="true">' + items + "</div></div>";
    // Normalización óptica: iguala el "peso visual" de cada logo según
    // sus píxeles reales (los anchos tipo wordmark bajan de altura, los
    // cuadrados suben), no según el tamaño del PNG.
    $$(".marquesina_logo", contClientes).forEach((img) => {
      const ajustar = () => {
        const ar = img.naturalWidth / img.naturalHeight || 1.9;
        // factor óptico según proporción + escala manual del cliente
        const factor =
          Math.min(1.5, Math.max(0.42, Math.sqrt(1.9 / ar))) *
          (parseFloat(img.dataset.escala) || 1);
        img.style.height = "calc(clamp(2.7rem, 4.4vw, 4rem) * " + factor.toFixed(3) + ")";
      };
      if (img.complete && img.naturalWidth) ajustar();
      else img.addEventListener("load", ajustar, { once: true });
    });

    // Optimización: el slider solo se anima cuando está en pantalla
    if ("IntersectionObserver" in window) {
      const pistas = $$(".marquesina_pista", contClientes);
      new IntersectionObserver(
        (entradas) =>
          entradas.forEach((e) =>
            pistas.forEach((p) => (p.style.animationPlayState = e.isIntersecting ? "running" : "paused"))
          ),
        { rootMargin: "50px" }
      ).observe(contClientes);
    }
  }

  // Grid de proyectos (data-grid="todos" | "destacados")
  function crearTarjeta(p, i, uniforme) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tarjeta" + (p.tamano === "grande" && !uniforme ? " tarjeta--grande" : "") + (p.videoHover ? " con-video" : "");
    btn.dataset.proyecto = i;
    btn.dataset.revelar = "";
    btn.setAttribute("aria-label", "Watch: " + p.titulo + " — " + p.cliente);
    btn.innerHTML =
      '<div class="tarjeta_visual">' +
      // La primera tarjeta (grande) carga con prioridad; el resto en diferido
      '<img src="' + p.miniatura + '" alt="' + p.titulo + '" decoding="async" ' +
      (p.tamano === "grande" ? 'fetchpriority="high"' : 'loading="lazy"') +
      (p.posicion ? ' style="object-position:' + p.posicion + '"' : "") +
      ' onerror="this.onerror=null;this.src=\'assets/img/placeholder.svg\'">' +
      (p.videoHover
        ? '<video muted loop playsinline preload="none" src="' + p.videoHover + '"></video>'
        : "") +
      '<span class="tarjeta_velo"></span>' +
      (p.logoCliente
        ? '<img class="tarjeta_logo" src="' + p.logoCliente + '" alt="" loading="lazy"' +
          (p.logoEscala ? ' style="height:calc(clamp(2.8rem, 5vw, 4.4rem) * ' + p.logoEscala + ')"' : "") + ">"
        : "") +
      "</div>" +
      '<div class="tarjeta_info">' +
      '<span class="tarjeta_titulo">' + p.titulo + "</span>" +
      '<span class="tarjeta_meta">' +
      '<span class="etiqueta">' + p.cliente + "</span>" +
      "</span></div>";
    return btn;
  }

  $$("[data-grid]").forEach((grid) => {
    const uniforme = grid.dataset.grid === "todos"; // Work: todos iguales
    const lista =
      grid.dataset.grid === "destacados"
        ? C.proyectos.filter((p) => p.destacado)
            .sort((x, y) => (x.ordenPortada || 99) - (y.ordenPortada || 99))
        : C.proyectos;
    lista.forEach((p) => grid.appendChild(crearTarjeta(p, C.proyectos.indexOf(p), uniforme)));
  });

  /* ==========================================================
     2. HOVER DE TARJETAS: reproduce el video de preview
     (patrón: crossfade imagen→video en mouseenter)
     ========================================================== */
  // Crea el player de Vimeo de una tarjeta (aparece hasta que el video
  // realmente reproduce, para que nunca se vea el arranque negro)
  function montarPlayer(tarjeta, p) {
    const inicio = (p.video && p.video.inicio) || 1; // salta el primer segundo
    const iframe = document.createElement("iframe");
    iframe.src =
      "https://player.vimeo.com/video/" + p.video.id +
      "?background=1&autoplay=1&muted=1&loop=1&autopause=0&playsinline=1&dnt=1" +
      (inicio ? "#t=" + inicio + "s" : "");
    iframe.allow = "autoplay";
    iframe.tabIndex = -1;
    iframe.setAttribute("aria-hidden", "true");
    const [aw, ah] = (p.video.aspecto || "16x9").split(/[x:]/).map(Number);
    const ar = aw && ah ? aw / ah : 16 / 9;
    iframe.style.cssText =
      "position:absolute;top:50%;left:50%;" +
      "transform:translate(-50%,-50%) scale(1.04);" +
      "aspect-ratio:" + ar + ";min-width:100.5%;min-height:100.5%;" +
      "width:auto;height:auto;border:0;pointer-events:none;";
    const alMensaje = (ev) => {
      if (ev.source !== iframe.contentWindow) return;
      let d; try { d = JSON.parse(ev.data); } catch (_) { return; }
      if (d.event === "playProgress" || d.event === "timeupdate") {
        iframe.classList.add("cargado");
        // Con "inicio" definido, cada vuelta del loop salta el arranque
        // negro; sin él, el listener ya no hace falta.
        const seg = d.data && d.data.seconds;
        if (inicio && typeof seg === "number" && seg < inicio - 0.4) {
          iframe.contentWindow.postMessage(JSON.stringify({ method: "setCurrentTime", value: inicio }), "*");
        } else if (!inicio) {
          window.removeEventListener("message", alMensaje);
        }
      }
    };
    window.addEventListener("message", alMensaje);
    iframe.addEventListener("load", () => {
      iframe.contentWindow.postMessage(JSON.stringify({ method: "addEventListener", value: "playProgress" }), "*");
      setTimeout(() => {
        if (document.visibilityState === "visible") iframe.classList.add("cargado");
      }, 2800);
    });
    $(".tarjeta_visual", tarjeta).appendChild(iframe);
    return iframe;
  }

  $$(".tarjeta").forEach((tarjeta) => {
    const video = $("video", tarjeta);
    const p = C.proyectos[+tarjeta.dataset.proyecto];
    const esGrande = tarjeta.classList.contains("tarjeta--grande");
    const esVimeo = !video && p && p.video && p.video.tipo === "vimeo";
    let iframe = null;
    const orden = (m) =>
      iframe && iframe.contentWindow &&
      iframe.contentWindow.postMessage(JSON.stringify({ method: m }), "*");

    // La tarjeta GRANDE reproduce sola en cuanto entra a pantalla;
    // fuera de pantalla se pausa.
    if (esGrande && esVimeo) {
      new IntersectionObserver(
        (entradas) => {
          entradas.forEach((e) => {
            if (e.isIntersecting) {
              if (!iframe) iframe = montarPlayer(tarjeta, p);
              else orden("play");
            } else if (iframe) {
              orden("pause");
            }
          });
        },
        { rootMargin: "150px" }
      ).observe(tarjeta);
    }

    // Hover (como la referencia): el video del proyecto se reproduce
    // seamless dentro de la tarjeta; al salir, se pausa y regresa la imagen.
    tarjeta.addEventListener("mouseenter", () => {
      tarjeta.classList.add("hover-activo");
      if (video) video.play().catch(() => {});
      else if (esVimeo && !esGrande) {
        if (!iframe) iframe = montarPlayer(tarjeta, p);
        else orden("play");
      }
    });
    tarjeta.addEventListener("mouseleave", () => {
      tarjeta.classList.remove("hover-activo");
      if (video) {
        video.pause();
        video.currentTime = 0;
      } else if (!esGrande && iframe) {
        orden("pause");
      }
    });
  });

  /* ==========================================================
     3. MODAL DE VIDEO (reproductor a pantalla completa)
     ========================================================== */
  const modal = $(".modal-video");
  const marco = $(".modal-video_marco");
  let tlModal = null;

  function urlEmbed(video) {
    if (video.tipo === "vimeo")
      return "https://player.vimeo.com/video/" + video.id + "?autoplay=1&title=0&byline=0&portrait=0";
    if (video.tipo === "youtube")
      return "https://www.youtube-nocookie.com/embed/" + video.id + "?autoplay=1&rel=0";
    return null;
  }

  // Pausa/reanuda los players de las tarjetas grandes (evita que sigan
  // reproduciendo detrás del reproductor abierto)
  function playersTarjetas(metodo) {
    $$(".tarjeta_visual iframe").forEach((f) => {
      if (f.contentWindow) f.contentWindow.postMessage(JSON.stringify({ method: metodo }), "*");
    });
  }

  function abrirModal(p) {
    if (!modal) return;
    playersTarjetas("pause");
    // Panel de información (como el detalle de la referencia)
    $(".modal-video_titulo", modal).textContent = p.titulo;
    $(".modal-video_cliente", modal).textContent = p.cliente;
    $(".modal-video_categoria", modal).textContent = p.categoria || "—";
    $(".modal-video_anio", modal).textContent = p.anio || "—";
    const desc = $(".modal-video_descripcion", modal);
    desc.textContent = p.descripcion || "";
    desc.style.display = p.descripcion ? "" : "none";
    const url = urlEmbed(p.video);
    if (url) {
      marco.innerHTML = '<iframe src="' + url + '" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="' + p.titulo + '"></iframe>';
    } else {
      marco.innerHTML = '<video src="' + p.video.ruta + '" controls autoplay playsinline></video>';
    }
    if (window.lenis) window.lenis.stop();
    document.body.style.overflow = "hidden";
    modal.showModal();
    if (tlModal) tlModal.play(0);
  }

  function cerrarModal() {
    if (tlModal && !reducirMovimiento) tlModal.reverse();
    else alCerrar();
  }

  function alCerrar() {
    marco.innerHTML = ""; // detiene la reproducción
    modal.close();
    if (window.lenis) window.lenis.start();
    document.body.style.overflow = "";
    playersTarjetas("play"); // reanuda el video de la tarjeta grande
  }

  if (modal) {
    document.addEventListener("click", (e) => {
      const tarjeta = e.target.closest("[data-proyecto]");
      if (tarjeta) abrirModal(C.proyectos[+tarjeta.dataset.proyecto]);
      if (e.target.closest("[data-cerrar-modal]")) cerrarModal();
    });
    modal.addEventListener("cancel", (e) => {
      e.preventDefault();
      cerrarModal();
    });
    modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target.classList.contains("modal-video_contenido")) cerrarModal();
    });
  }

  /* ==========================================================
     4. ANIMACIONES (GSAP + Lenis)
     ========================================================== */
  if (typeof gsap === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, Flip);

  // Smooth scroll con Lenis
  if (typeof Lenis !== "undefined" && !reducirMovimiento) {
    const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1 });
    window.lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  if (modal && !reducirMovimiento) {
    tlModal = gsap.timeline({ paused: true, onReverseComplete: alCerrar });
    tlModal
      .fromTo(".modal-video_fondo", { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power1.out" })
      .fromTo(".modal-video_caja", { opacity: 0, y: "6rem" }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }, "<0.05");
  }

  /* --- Nav: subrayado que viaja entre enlaces (FLIP) --- */
  const navLinks = $$(".nav_link");
  const navBorde = $(".nav_borde");
  const navWrap = $(".nav_links");
  if (navBorde && navWrap && navLinks.length) {
    const ruta = location.pathname.split("/").pop() || "index.html";
    navLinks.forEach((l) => {
      if (l.getAttribute("href") === ruta) l.classList.add("activo");
    });
    gsap.set(navBorde, { opacity: 0 });
    navLinks.forEach((link) => {
      link.addEventListener("mouseenter", function () {
        const oculto = gsap.getProperty(navBorde, "opacity") < 0.1;
        if (oculto) {
          this.appendChild(navBorde);
          gsap.to(navBorde, { opacity: 1, duration: 0.3, ease: "power1.inOut" });
        } else {
          const estado = Flip.getState(navBorde);
          this.appendChild(navBorde);
          Flip.from(estado, { duration: 0.4, ease: "power1.inOut" });
        }
      });
    });
    navWrap.addEventListener("mouseleave", () => {
      gsap.to(navBorde, { opacity: 0, duration: 0.3, ease: "power1.inOut" });
    });
  }

  /* --- Nav: se oculta al bajar, reaparece al subir --- */
  const nav = $(".nav");
  if (nav && !reducirMovimiento) {
    const ocultarNav = gsap.to(nav, { yPercent: -100, duration: 0.3, ease: "power2.inOut", paused: true });
    ScrollTrigger.create({
      start: "top top-=" + 80,
      end: "max",
      onUpdate: (self) => {
        if (document.body.style.overflow === "hidden") return;
        self.direction === 1 ? ocultarNav.play() : ocultarNav.reverse();
      },
    });
  }

  /* --- Nav: cambia de color según la sección debajo --- */
  if (nav) {
    const secciones = $$("[data-tema]");
    function resolverTemaNav() {
      const h = nav.offsetHeight;
      for (let i = secciones.length - 1; i >= 0; i--) {
        const r = secciones[i].getBoundingClientRect();
        if (r.top <= h && r.bottom > h) {
          const tema = secciones[i].dataset.tema;
          // El nav usa texto oscuro solo sobre secciones claras ("luz" o "acento")
          nav.classList.toggle("nav--tinta", tema === "luz" || tema === "acento");
          return;
        }
      }
    }
    secciones.forEach((sec) => {
      ScrollTrigger.create({
        trigger: sec,
        start: () => "top " + nav.offsetHeight,
        end: () => "bottom " + nav.offsetHeight,
        onToggle: resolverTemaNav,
        invalidateOnRefresh: true,
      });
    });
    ScrollTrigger.addEventListener("scrollEnd", resolverTemaNav);
    resolverTemaNav();
  }

  /* --- Menú móvil --- */
  const hamburguesa = $(".nav_hamburguesa");
  const menuMovil = $(".menu-movil");
  if (hamburguesa && menuMovil) {
    const enlaces = $$("a > span", menuMovil);
    const tlMenu = gsap.timeline({ paused: true });
    tlMenu
      .set(menuMovil, { visibility: "visible" })
      .to(menuMovil, { clipPath: "inset(0 0 0% 0)", duration: 0.5, ease: "power3.inOut" })
      .from(enlaces, { yPercent: 110, duration: 0.5, stagger: 0.06, ease: "power3.out" }, "-=0.15");
    let abierto = false;
    hamburguesa.addEventListener("click", () => {
      abierto = !abierto;
      hamburguesa.classList.toggle("abierto", abierto);
      if (abierto) {
        if (window.lenis) window.lenis.stop();
        tlMenu.play();
      } else {
        if (window.lenis) window.lenis.start();
        tlMenu.reverse();
      }
    });
  }

  /* --- Entrada del hero (título línea por línea) --- */
  const lineasHero = $$(".hero_linea > span");
  if (lineasHero.length && !reducirMovimiento) {
    gsap.from(lineasHero, {
      yPercent: 110,
      duration: 1,
      stagger: 0.12,
      ease: "power4.out",
      delay: 0.3,
    });
  }

  /* --- Optimización: recalcula posiciones de scroll cuando terminan
         de cargar las imágenes (evita reveals desfasados) --- */
  window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });

  /* --- Reveals al hacer scroll (fade + subida, en lotes) --- */
  const revelables = $$("[data-revelar]");
  if (revelables.length) {
    if (reducirMovimiento) {
      gsap.set(revelables, { autoAlpha: 1, y: 0 });
    } else {
      gsap.set(revelables, { autoAlpha: 0, y: 50 });
      ScrollTrigger.batch(revelables, {
        once: true,
        start: "top 95%",
        onEnter: (lote) =>
          gsap.to(lote, {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.12,
            overwrite: "auto",
            onComplete: () => gsap.set(lote, { clearProps: "willChange" }),
          }),
      });
    }
  }
})();
