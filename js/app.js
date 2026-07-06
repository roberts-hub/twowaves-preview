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

  // Marca (logo, título de pestaña, pie)
  $$("[data-marca]").forEach((el) => (el.textContent = C.marca.nombre));
  document.title = document.title.replace("{{marca}}", C.marca.nombre);

  // Textos sueltos: <span data-texto="portada.subtitulo"></span>
  $$("[data-texto]").forEach((el) => {
    const valor = el.dataset.texto.split(".").reduce((o, k) => (o ? o[k] : ""), C);
    if (valor) el.textContent = valor;
  });

  // Año dinámico
  $$("[data-anio]").forEach((el) => (el.textContent = new Date().getFullYear()));

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

  // Hero de portada
  const heroFondo = $("[data-hero-fondo]");
  if (heroFondo) {
    const img = document.createElement("img");
    img.src = C.portada.imagenFondo;
    img.alt = "";
    heroFondo.prepend(img);
    if (C.portada.videoFondo && !reducirMovimiento) {
      const vid = document.createElement("video");
      Object.assign(vid, { src: C.portada.videoFondo, muted: true, loop: true, playsInline: true, autoplay: true });
      vid.setAttribute("muted", "");
      vid.setAttribute("playsinline", "");
      heroFondo.append(vid); // el video va encima del poster
      vid.play().catch(() => {});
    }
  }

  // Título del hero (3 líneas configurables)
  const heroTitulo = $("[data-hero-titulo]");
  if (heroTitulo) {
    heroTitulo.innerHTML =
      '<span class="hero_linea"><span>' + C.portada.tituloLinea1 + "</span></span>" +
      '<span class="hero_linea"><span class="acento-serif">' + C.portada.tituloAcento + "</span></span>" +
      '<span class="hero_linea"><span>' + C.portada.tituloLinea2 + "</span></span>";
  }

  // Marquesina de clientes (duplicada para loop continuo)
  const marquesina = $("[data-marquesina]");
  if (marquesina) {
    const items = C.clientes.map((n) => '<span class="marquesina_item">' + n + "</span>").join("");
    marquesina.innerHTML =
      '<div class="marquesina_pista">' + items + "</div>" +
      '<div class="marquesina_pista" aria-hidden="true">' + items + "</div>";
  }

  // Grid de proyectos (data-grid="todos" | "destacados")
  const iconoPlay =
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 3.5v17l14-8.5z"/></svg>';

  function crearTarjeta(p, i) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tarjeta" + (p.tamano === "grande" ? " tarjeta--grande" : "") + (p.videoHover ? " con-video" : "");
    btn.dataset.proyecto = i;
    btn.dataset.revelar = "";
    btn.setAttribute("aria-label", "Ver video: " + p.titulo + " — " + p.cliente);
    btn.innerHTML =
      '<div class="tarjeta_visual">' +
      '<img src="' + p.miniatura + '" alt="' + p.titulo + '" loading="lazy" onerror="this.onerror=null;this.src=\'assets/img/placeholder.svg\'">' +
      (p.videoHover
        ? '<video muted loop playsinline preload="none" src="' + p.videoHover + '"></video>'
        : "") +
      '<span class="tarjeta_boton-play">' + iconoPlay + "</span>" +
      "</div>" +
      '<div class="tarjeta_info">' +
      '<span class="tarjeta_titulo">' + p.titulo + "</span>" +
      '<span class="tarjeta_meta">' +
      '<span class="tarjeta_chip">' + p.categoria + "</span>" +
      '<span class="etiqueta">' + p.cliente + " · " + p.anio + "</span>" +
      "</span></div>";
    return btn;
  }

  $$("[data-grid]").forEach((grid) => {
    const lista =
      grid.dataset.grid === "destacados"
        ? C.proyectos.filter((p) => p.destacado)
        : C.proyectos;
    lista.forEach((p) => grid.appendChild(crearTarjeta(p, C.proyectos.indexOf(p))));
  });

  /* ==========================================================
     2. HOVER DE TARJETAS: reproduce el video de preview
     (patrón: crossfade imagen→video en mouseenter)
     ========================================================== */
  $$(".tarjeta").forEach((tarjeta) => {
    const video = $("video", tarjeta);
    if (!video) return;
    tarjeta.addEventListener("mouseenter", () => {
      tarjeta.classList.add("hover-activo");
      video.play().catch(() => {});
    });
    tarjeta.addEventListener("mouseleave", () => {
      tarjeta.classList.remove("hover-activo");
      video.pause();
      video.currentTime = 0;
    });
  });

  /* ==========================================================
     3. MODAL DE VIDEO (reproductor a pantalla completa)
     ========================================================== */
  const modal = $(".modal-video");
  const marco = $(".modal-video_marco");
  const tituloModal = $(".modal-video_titulo");
  let tlModal = null;

  function urlEmbed(video) {
    if (video.tipo === "vimeo")
      return "https://player.vimeo.com/video/" + video.id + "?autoplay=1&title=0&byline=0&portrait=0";
    if (video.tipo === "youtube")
      return "https://www.youtube-nocookie.com/embed/" + video.id + "?autoplay=1&rel=0";
    return null;
  }

  function abrirModal(p) {
    if (!modal) return;
    tituloModal.textContent = p.titulo + " — " + p.cliente;
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
      .fromTo(".modal-video_marco", { opacity: 0, y: "6rem" }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }, "<0.05");
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
