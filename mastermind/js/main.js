/* ═══════════════════════════════════════════════
   MASTERMIND — TWO WAVES FILMS
   Intro (loader) + reveals al hacer scroll.
   ═══════════════════════════════════════════════ */

// ── PANTALLA DE CARGA (intro) ──
const loader = document.getElementById("loader");
const intro = loader.querySelector(".loader-intro");
const introBtn = document.getElementById("intro-btn");
const glyphs = loader.querySelectorAll(".glyph");
const PASO = 210;

function revelarHero() {
  document.querySelectorAll(".hero .reveal").forEach((el) => el.classList.add("visto"));
}

// La intro se muestra solo una vez por sesión (menos fricción al volver).
let introVista = false;
try { introVista = sessionStorage.getItem("mm_intro_vista") === "1"; } catch (e) {}

if (introVista) {
  loader.remove();
  revelarHero();
} else {
  document.body.classList.add("cargando");

  let entrado = false;
  const entrar = () => {
    if (entrado) return;
    entrado = true;
    try { sessionStorage.setItem("mm_intro_vista", "1"); } catch (e) {}
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
      revelarHero();
    }, 350 + glyphs.length * PASO + 420);
  };

  // separa cada línea en palabras con delay en cascada
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
      // Auto-avance: si no dan clic, entra solo (no perder leads).
      setTimeout(entrar, t + 600 + 2600);
    }
  });

  introBtn.addEventListener("click", entrar, { once: true });
}

// ── REVEALS AL HACER SCROLL ──
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visto");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll("body > :not(.hero) .reveal").forEach((el) => observer.observe(el));
