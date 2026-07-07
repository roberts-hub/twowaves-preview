/* ============================================================
   CONTENIDO.JS — ESTE ES TU ARCHIVO DE EDICIÓN
   ------------------------------------------------------------
   Todo el contenido del sitio vive aquí: textos, proyectos,
   clientes y datos de contacto. Edita este archivo, guarda,
   y recarga el navegador. No necesitas tocar el HTML ni el CSS.

   Lee GUIA-DE-EDICION.md para instrucciones paso a paso.
   ============================================================ */

window.CONTENIDO = {

  /* ---------- MARCA ---------- */
  marca: {
    nombre: "TWO WAVES",
    eslogan: "Films | Production Company",
    ciudad: "Guadalajara, MX — EST. 2021",
  },

  /* ---------- PORTADA (index.html) ----------
     Deja tituloLinea2 en "" si quieres un título de solo dos líneas.

     videoFondo acepta 3 formas:
       ""                                        → solo imagen
       "assets/videos/reel.mp4"                  → archivo propio o enlace .mp4
       { tipo: "vimeo", id: "997119368", aspecto: "3840x1920" }
                                                 → video de Vimeo en loop silencioso
     "aspecto" son las dimensiones del video (ancho x alto); si no lo
     pones se asume 16:9. La imagenFondo se muestra mientras carga.  */
  portada: {
    tituloLinea1: "Visual narratives",
    tituloAcento: "with intention.",
    tituloLinea2: "",
    subtitulo: "Based in Mexico — Available worldwide",
    videoFondo: { tipo: "vimeo", id: "997119368", aspecto: "3840x1920" },
    imagenFondo: "https://i.vimeocdn.com/video/1913280099-d00b614e9dd0bf536793b488e210fe622bf6c0adbf4a344a54b6ac15d7cf0ed8-d_1280?region=us",
  },

  /* ---------- CLIENTES (banda de logos) ----------
     Copia tus logos .png a assets/img/logos/ y escribe la ruta en
     "logo". SOLO los clientes con logo aparecen en la banda; si
     ninguno tiene logo, se muestran los nombres en texto (temporal).
     Para dejarlos en blanco puro: python3 herramientas/logos-a-blanco.py
     "escala" (opcional) agranda o encoge un logo puntual: 0.7 = 30% más
     chico, 1.2 = 20% más grande. */
  clientes: [
    { nombre: "Ford", logo: "assets/img/logos/ford.png" },
    { nombre: "Cupra", logo: "assets/img/logos/cupra.png" },
    { nombre: "Lamborghini", logo: "assets/img/logos/lamborghini.png" },
    { nombre: "Porsche", logo: "assets/img/logos/porsche.png", escala: 0.5 },
    { nombre: "Lexus", logo: "assets/img/logos/lexus.png" },
    { nombre: "Red Bull", logo: "assets/img/logos/red-bull.png" },
    { nombre: "FIFA", logo: "assets/img/logos/fifa.png" },
    { nombre: "Alo Yoga", logo: "assets/img/logos/alo-yoga.png" },
    { nombre: "Oakley", logo: "assets/img/logos/oakley.png" },
    { nombre: "Skechers", logo: "assets/img/logos/skechers.png", escala: 0.82 },
    { nombre: "Kérastase", logo: "assets/img/logos/kerastase.png" },
    { nombre: "Longines", logo: "assets/img/logos/longines.png" },
    { nombre: "Amazon Business", logo: "assets/img/logos/amazon-business.png" },
    { nombre: "Televisa", logo: "assets/img/logos/televisa.png" },
    { nombre: "TV Azteca", logo: "assets/img/logos/tv-azteca.png" },
    { nombre: "Beautiful Destinations", logo: "assets/img/logos/beautiful-destinations.png" },
  ],

  /* ---------- PROYECTOS ----------
     Cada proyecto es un bloque { ... }. Para AGREGAR uno, copia
     un bloque completo (de { a },) y pégalo al inicio de la lista.
     Para QUITARLO, borra el bloque completo.

     Campos:
       titulo      → nombre del proyecto
       descripcion → texto corto que aparece en el reproductor (editable)
       cliente     → marca o cliente
       categoria   → ej. "Comercial", "Turismo", "Música"
       anio        → año
       tamano      → "grande" (ancho completo) o "normal" (media columna)
       destacado   → true = también aparece en la portada
       miniatura   → imagen que se ve antes del hover
       logoCliente → (opcional) logo blanco del cliente centrado sobre el
                     video, como la referencia (ruta a un .png de logos/)
       posicion    → (opcional) encuadre de la miniatura, ej. "82% 50%"
                     (izquierda–derecha % y arriba–abajo %)
       videoHover  → .mp4 corto y silencioso que se reproduce al pasar el mouse
                     (déjalo en "" si no tienes preview)
       video       → el video completo que abre el reproductor:
                       { tipo: "vimeo",   id: "123456789" }
                       ("inicio: 2" opcional = arranca en ese segundo;
                        por default todos arrancan en el segundo 1)
                       { tipo: "youtube", id: "AbCdEfGhIjK" }
                       { tipo: "archivo", ruta: "assets/videos/mi-video.mp4" }
  ------------------------------------------------------ */
  proyectos: [
    {
      titulo: "Visit Jalisco",
      descripcion: "Travel campaign with Beautiful Destinations — Jalisco from the coast to the highlands, shot at home.",
      cliente: "Beautiful Destinations",
      categoria: "Travel",
      anio: "2026",
      tamano: "grande",
      destacado: true,
      miniatura: "https://i.vimeocdn.com/video/2176700800-1ee2efadcb1d1380d45a1cbaa4988beae76afdb2118d4e42e25d53bd19a2944b-d_1280?region=us",
      videoHover: "",
      video: { tipo: "vimeo", id: "1207583391", aspecto: "3840x2076", inicio: 2 },
    },
    {
      titulo: "Grand Island",
      logoCliente: "assets/img/logos/mondrian.png",
      descripcion: "Lifestyle film for Grand Island by Mondrian — a day on the water, shot from above.",
      cliente: "Mondrian",
      categoria: "Hospitality",
      anio: "2026",
      tamano: "normal",
      destacado: true,
      miniatura: "https://i.vimeocdn.com/video/2110982172-7a16e0202a31b2cedc8f7cc93eb51bf8a1acf4b84b43330a614288ecce753496-d_960?region=us",
      videoHover: "",
      video: { tipo: "vimeo", id: "1157343263", aspecto: "3840x1920" },
    },
    {
      titulo: "Cupra Formentor",
      logoCliente: "assets/img/logos/cupra.png",
      logoEscala: 1.3,
      descripcion: "CUPRA Formentor — performance and design, shot for the road.",
      posicion: "82% 50%",
      cliente: "Cupra",
      categoria: "Commercial",
      anio: "2024",
      tamano: "normal",
      destacado: true,
      miniatura: "https://i.vimeocdn.com/video/1816992186-4633eafa8290fdf1fb70c300642694162bc84d62a1301db9b35de5e2bb70e14b-d_960?region=us",
      videoHover: "",
      video: { tipo: "vimeo", id: "924254132", aspecto: "3840x1634" },
    },
    {
      titulo: "Let's Go Brazil",
      descripcion: "Travel campaign with Beautiful Destinations — Brazil in motion, coast to coast.",
      cliente: "Beautiful Destinations",
      categoria: "Travel",
      anio: "2025",
      tamano: "normal",
      destacado: true,
      miniatura: "https://i.vimeocdn.com/video/2087626357-b97063df4dbd64b285d4ff2f7e6cfa3108cece51881f237f52d1e0e99ccad8e1-d_960?region=us",
      videoHover: "",
      video: { tipo: "vimeo", id: "1140562321", aspecto: "3840x1600" },
    },
    {
      titulo: "Alo Yoga Retreat",
      descripcion: "Wellness retreat with Alo Yoga at One&Only Mandarina — slow mornings, ocean light.",
      cliente: "One&Only Mandarina",
      categoria: "Wellness",
      anio: "2025",
      tamano: "normal",
      destacado: true,
      miniatura: "https://i.vimeocdn.com/video/2007514743-8e2cb9215b144f3867bc81d6f8e1d32a9c08cba017aef426ca9a28eafb801a8d-d_960?region=us",
      videoHover: "",
      video: { tipo: "vimeo", id: "1077478660", aspecto: "3840x2160" },
    },
    {
      titulo: "Bear Grylls x AION",
      descripcion: "Not every production is a shoot — some are an expedition. Seven days off the grid on Calivigny, a private island in Grenada, closing with a 1,000-drone show, the first of its kind in this part of the world.",
      cliente: "AION",
      categoria: "Drone show",
      anio: "2026",
      tamano: "normal",
      destacado: false,
      miniatura: "assets/img/bear-grylls.jpg",
      videoHover: "",
      video: { tipo: "vimeo", id: "1169670961", aspecto: "3840x1920", inicio: 2 },
    },
    {
      titulo: "MB Motos",
      descripcion: "Commercial for MB Motos México — two wheels, open road, and the feeling of the ride.",
      cliente: "MB Motos México",
      categoria: "Commercial",
      anio: "2026",
      tamano: "normal",
      destacado: false,
      miniatura: "https://i.vimeocdn.com/video/2121186002-e089a3ac2b0a52b386eb0a8d3f2b35ff872056e5d89e48f467a3d5b185253a8e-d_960?region=us",
      videoHover: "",
      video: { tipo: "vimeo", id: "1164516769", aspecto: "3840x1606" },
    },
    {
      titulo: "Tito Double P x Cashonly",
      descripcion: "Night energy and fast cuts — on set with Tito Double P for Cashonly.",
      cliente: "Cashonly",
      categoria: "Music video",
      anio: "2025",
      tamano: "normal",
      destacado: false,
      miniatura: "https://i.vimeocdn.com/video/2092677014-7c3834b56c434b7e63d9cc315d1a01f27fef51436b0f1b909711fd697b393511-d_960?region=us",
      videoHover: "",
      video: { tipo: "vimeo", id: "1144201735", aspecto: "3840x2160" },
    },
    {
      titulo: "Lençóis Maranhenses",
      descripcion: "Beautiful Destinations in Lençóis Maranhenses — dunes, lagoons and light.",
      cliente: "Beautiful Destinations",
      categoria: "Travel",
      anio: "2025",
      tamano: "normal",
      destacado: false,
      miniatura: "https://i.vimeocdn.com/video/2087621548-1733f8148ec3f287c4bfc8f90cc4865b59d44eb30d98b85d50f305502ef34181-d_960?region=us",
      videoHover: "",
      video: { tipo: "vimeo", id: "1140559385", aspecto: "3840x1920" },
    },
    {
      titulo: "Pequeña África",
      logoCliente: "assets/img/logos/beautiful-destinations.png",
      descripcion: "For Visit Brazil — the story of Rio's Pequeña África, told through its streets and people.",
      cliente: "Visit Brazil",
      categoria: "Travel",
      anio: "2025",
      tamano: "normal",
      destacado: false,
      miniatura: "https://i.vimeocdn.com/video/2080388745-bd7b627a56866df02e94b5d4b3f806e9cb8778759433df6c445d447c0063a862-d_960?region=us",
      videoHover: "",
      video: { tipo: "vimeo", id: "1135148329", aspecto: "3840x2160" },
    },
    {
      titulo: "Ricardo Salinas — 70 años",
      descripcion: "Event film for Ricardo Salinas' 70th anniversary — one night, told in two minutes.",
      cliente: "Ricardo Salinas",
      categoria: "Event",
      anio: "2025",
      tamano: "normal",
      destacado: false,
      miniatura: "https://i.vimeocdn.com/video/2080383136-a4d6bf9354ae227ca2fe5f4fb104303033d6dc26b3bbc28994c7f43076506f53-d_960?region=us",
      videoHover: "",
      video: { tipo: "vimeo", id: "1135144526", aspecto: "3840x1620" },
    },
    {
      titulo: "Brand Ambassador",
      descripcion: "Sports campaign for Atlética — training, sweat and their new brand ambassador.",
      cliente: "Atlética",
      categoria: "Sports",
      anio: "2025",
      tamano: "normal",
      destacado: false,
      miniatura: "https://i.vimeocdn.com/video/2080381492-60877576ddb2b7a8ea046424d1015c3326f1b72f5a89d4de9ecba3ff90108b4d-d_960?region=us",
      videoHover: "",
      video: { tipo: "vimeo", id: "1135143672", aspecto: "3840x1920" },
    },
    {
      titulo: "Tequila Herradura x FICG",
      descripcion: "Tequila Herradura at FICG — an event piece with cinema at its center.",
      cliente: "Tequila Herradura",
      categoria: "Event",
      anio: "2024",
      tamano: "normal",
      destacado: false,
      miniatura: "https://i.vimeocdn.com/video/1960869647-a8ff147a97fc747da72e9cbf5e93519df21201c7577c70cfbfc2d1a3aad3e20f-d_960?region=us",
      videoHover: "",
      video: { tipo: "vimeo", id: "1038640015", aspecto: "2160x3840" },
    },
    {
      titulo: "Alo Yoga x Javier Hernández",
      logoCliente: "assets/img/logos/alo-yoga.png",
      descripcion: "Alo Yoga with Javier 'Chicharito' Hernández — movement as daily practice.",
      cliente: "Alo Yoga",
      categoria: "Sports",
      anio: "2024",
      tamano: "normal",
      destacado: false,
      miniatura: "https://i.vimeocdn.com/video/1960863126-ab9a83d72470d7ab16ebb0c2730b613f805c7ff9524444be080c786880b7ac3f-d_960?region=us",
      videoHover: "",
      video: { tipo: "vimeo", id: "1038634019", aspecto: "1080x1920" },
    },
    {
      titulo: "Thunderbolts x Kings League",
      descripcion: "Marvel's Thunderbolts meet the Kings League pitch — director's cut. Agency: Diablo.",
      cliente: "Marvel",
      categoria: "Branded content",
      anio: "2025",
      tamano: "normal",
      destacado: false,
      miniatura: "https://i.vimeocdn.com/video/2017654325-d5c674f93c594adad492a542c5b19722d47a2828d905cbb327fbf75393eb0720-d_960?region=us",
      videoHover: "",
      video: { tipo: "vimeo", id: "1085979440", aspecto: "3840x1620" },
    },
  ],

  /* ---------- NOSOTROS (about.html) ---------- */
  nosotros: {
    titulo: "The result over the noise.",
    parrafos: [
      "Two Waves is a production company founded in 2021 in Guadalajara, México. Commercial content for global brands — built with clarity, intention and a distinctive creative standard, from idea to final master.",
    ],
    servicios: [
      "Direction", "Production", "Cinematography",
      "Aerials", "Post-production", "Color",
    ],
    /* Las 3 fases de trabajo que se muestran en About */
    proceso: [
      { paso: "01", titulo: "Concept & Direction", texto: "We listen, define the idea and set the creative direction with you." },
      { paso: "02", titulo: "Production", texto: "On set or on location — direction, cinematography and aerials under one roof." },
      { paso: "03", titulo: "Post & Delivery", texto: "Edit, color and sound design, down to the final master." },
    ],
  },

  /* ---------- FUNDADORES (about.html) ---------- */
  fundadores: {
    etiqueta: "The founders",
    titulo: "Meet the founders",
    parrafos: [
      "Two Waves was founded by Rogelio and Roberto, two filmmakers from Guadalajara who grew up with the same instinct: to create, to film, and to build stories bigger than the tools they had at the time.",
      "Different paths within the industry, one aligned direction. Years of refining their craft became a way of working that values intention, clarity, and strong visual identity: a studio built by two people who never questioned whether it was possible, only how far it could go.",
    ],
    foto: "assets/img/founders.jpg",
    nombres: [],
  },

  /* ---------- WHY TWO WAVES (about.html) ---------- */
  porque: {
    titulo: "Why Two Waves?",
    parrafos: [
      "Choosing Two Waves means partnering with a team that treats every project with intention, clarity, and a strong sense of craft: careful planning, clean execution, and an editorial approach that gives each frame purpose.",
      "Our value comes from how we work. A streamlined structure keeps directors, producers, cinematographers, and editors under one workflow: efficient, consistent, and built to last.",
    ],
    destacado: "If you're looking for a team that prioritizes the result over the noise, you're in the right place.",
  },

  /* ---------- CONTACTO (contact.html) ---------- */
  contacto: {
    titulo: "Let's create something remarkable.",
    // ⚠️ Escribe aquí tu correo real de contacto:
    correo: "contacto@twowaves.mx",
    telefono: "",
    instagram: "https://www.instagram.com/twowaves.mx/",
    vimeo: "https://vimeo.com/twowavesfilms",
    direccion: "Guadalajara, MX",
  },
};
