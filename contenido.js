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
    ciudad: "Guadalajara, México — EST. 2021",
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
    tituloLinea1: "Narrativas visuales",
    tituloAcento: "con intención.",
    tituloLinea2: "",
    subtitulo: "Casa productora — Guadalajara, MX",
    videoFondo: { tipo: "vimeo", id: "997119368", aspecto: "3840x1920" },
    imagenFondo: "https://i.vimeocdn.com/video/1913280099-d00b614e9dd0bf536793b488e210fe622bf6c0adbf4a344a54b6ac15d7cf0ed8-d_1280?region=us",
  },

  /* ---------- CLIENTES (banda de logos) ----------
     Copia tus logos .png a assets/img/logos/ y escribe la ruta en
     "logo". SOLO los clientes con logo aparecen en la banda; si
     ninguno tiene logo, se muestran los nombres en texto (temporal).
     Para dejarlos en blanco puro: python3 herramientas/logos-a-blanco.py */
  clientes: [
    { nombre: "AION", logo: "" },
    { nombre: "MB Motos", logo: "" },
    { nombre: "Mondrian", logo: "" },
    { nombre: "Beautiful Destinations", logo: "" },
    { nombre: "Marvel", logo: "" },
    { nombre: "Kings League", logo: "" },
    { nombre: "Alo Yoga", logo: "" },
    { nombre: "Tequila Herradura", logo: "" },
    { nombre: "FICG", logo: "" },
    { nombre: "Atlética", logo: "" },
    { nombre: "One&Only Mandarina", logo: "" },
    { nombre: "Visit Brazil", logo: "" },
  ],

  /* ---------- PROYECTOS ----------
     Cada proyecto es un bloque { ... }. Para AGREGAR uno, copia
     un bloque completo (de { a },) y pégalo al inicio de la lista.
     Para QUITARLO, borra el bloque completo.

     Campos:
       titulo      → nombre del proyecto
       cliente     → marca o cliente
       categoria   → ej. "Comercial", "Turismo", "Música"
       anio        → año
       tamano      → "grande" (ancho completo) o "normal" (media columna)
       destacado   → true = también aparece en la portada
       miniatura   → imagen que se ve antes del hover
       videoHover  → .mp4 corto y silencioso que se reproduce al pasar el mouse
                     (déjalo en "" si no tienes preview)
       video       → el video completo que abre el reproductor:
                       { tipo: "vimeo",   id: "123456789" }
                       { tipo: "youtube", id: "AbCdEfGhIjK" }
                       { tipo: "archivo", ruta: "assets/videos/mi-video.mp4" }
  ------------------------------------------------------ */
  proyectos: [
    {
      titulo: "Bear Grylls x AION",
      cliente: "AION",
      categoria: "Drone show",
      anio: "2026",
      tamano: "grande",
      destacado: true,
      miniatura: "https://i.vimeocdn.com/video/2128519862-13a561d0f936cad53017e757a74a0062ac3269268ba4df012568f25335d0c6c7-d_1280?region=us",
      videoHover: "",
      video: { tipo: "vimeo", id: "1169670961" },
    },
    {
      titulo: "MB Motos",
      cliente: "MB Motos México",
      categoria: "Comercial",
      anio: "2026",
      tamano: "normal",
      destacado: true,
      miniatura: "https://i.vimeocdn.com/video/2121186002-e089a3ac2b0a52b386eb0a8d3f2b35ff872056e5d89e48f467a3d5b185253a8e-d_1280?region=us",
      videoHover: "",
      video: { tipo: "vimeo", id: "1164516769" },
    },
    {
      titulo: "Grand Island",
      cliente: "Mondrian",
      categoria: "Hotelería",
      anio: "2026",
      tamano: "normal",
      destacado: true,
      miniatura: "https://i.vimeocdn.com/video/2110982172-7a16e0202a31b2cedc8f7cc93eb51bf8a1acf4b84b43330a614288ecce753496-d_1280?region=us",
      videoHover: "",
      video: { tipo: "vimeo", id: "1157343263" },
    },
    {
      titulo: "Thunderbolts x Kings League",
      cliente: "Marvel",
      categoria: "Branded content",
      anio: "2025",
      tamano: "grande",
      destacado: true,
      miniatura: "https://i.vimeocdn.com/video/2017654325-d5c674f93c594adad492a542c5b19722d47a2828d905cbb327fbf75393eb0720-d_1280?region=us",
      videoHover: "",
      video: { tipo: "vimeo", id: "1085979440" },
    },
    {
      titulo: "Tito Double P x Cashonly",
      cliente: "Cashonly",
      categoria: "Música",
      anio: "2025",
      tamano: "normal",
      destacado: false,
      miniatura: "https://i.vimeocdn.com/video/2092677014-7c3834b56c434b7e63d9cc315d1a01f27fef51436b0f1b909711fd697b393511-d_1280?region=us",
      videoHover: "",
      video: { tipo: "vimeo", id: "1144201735" },
    },
    {
      titulo: "Let's Go Brazil",
      cliente: "Beautiful Destinations",
      categoria: "Turismo",
      anio: "2025",
      tamano: "normal",
      destacado: false,
      miniatura: "https://i.vimeocdn.com/video/2087626357-b97063df4dbd64b285d4ff2f7e6cfa3108cece51881f237f52d1e0e99ccad8e1-d_1280?region=us",
      videoHover: "",
      video: { tipo: "vimeo", id: "1140562321" },
    },
    {
      titulo: "Lençóis Maranhenses",
      cliente: "Beautiful Destinations",
      categoria: "Turismo",
      anio: "2025",
      tamano: "normal",
      destacado: false,
      miniatura: "https://i.vimeocdn.com/video/2087621548-1733f8148ec3f287c4bfc8f90cc4865b59d44eb30d98b85d50f305502ef34181-d_1280?region=us",
      videoHover: "",
      video: { tipo: "vimeo", id: "1140559385" },
    },
    {
      titulo: "Pequeña África",
      cliente: "Visit Brazil",
      categoria: "Turismo",
      anio: "2025",
      tamano: "normal",
      destacado: false,
      miniatura: "https://i.vimeocdn.com/video/2080388745-bd7b627a56866df02e94b5d4b3f806e9cb8778759433df6c445d447c0063a862-d_1280?region=us",
      videoHover: "",
      video: { tipo: "vimeo", id: "1135148329" },
    },
    {
      titulo: "Ricardo Salinas — 70 años",
      cliente: "Ricardo Salinas",
      categoria: "Evento",
      anio: "2025",
      tamano: "grande",
      destacado: false,
      miniatura: "https://i.vimeocdn.com/video/2080383136-a4d6bf9354ae227ca2fe5f4fb104303033d6dc26b3bbc28994c7f43076506f53-d_1280?region=us",
      videoHover: "",
      video: { tipo: "vimeo", id: "1135144526" },
    },
    {
      titulo: "Brand Ambassador",
      cliente: "Atlética",
      categoria: "Deporte",
      anio: "2025",
      tamano: "normal",
      destacado: false,
      miniatura: "https://i.vimeocdn.com/video/2080381492-60877576ddb2b7a8ea046424d1015c3326f1b72f5a89d4de9ecba3ff90108b4d-d_1280?region=us",
      videoHover: "",
      video: { tipo: "vimeo", id: "1135143672" },
    },
    {
      titulo: "Alo Yoga Retreat",
      cliente: "One&Only Mandarina",
      categoria: "Wellness",
      anio: "2025",
      tamano: "normal",
      destacado: false,
      miniatura: "https://i.vimeocdn.com/video/2007514743-8e2cb9215b144f3867bc81d6f8e1d32a9c08cba017aef426ca9a28eafb801a8d-d_1280?region=us",
      videoHover: "",
      video: { tipo: "vimeo", id: "1077478660" },
    },
    {
      titulo: "Tequila Herradura x FICG",
      cliente: "Tequila Herradura",
      categoria: "Evento",
      anio: "2024",
      tamano: "normal",
      destacado: false,
      miniatura: "https://i.vimeocdn.com/video/1960869647-a8ff147a97fc747da72e9cbf5e93519df21201c7577c70cfbfc2d1a3aad3e20f-d_1280?region=us",
      videoHover: "",
      video: { tipo: "vimeo", id: "1038640015" },
    },
    {
      titulo: "Alo Yoga x Javier Hernández",
      cliente: "Alo Yoga",
      categoria: "Deporte",
      anio: "2024",
      tamano: "normal",
      destacado: false,
      miniatura: "https://i.vimeocdn.com/video/1960863126-ab9a83d72470d7ab16ebb0c2730b613f805c7ff9524444be080c786880b7ac3f-d_1280?region=us",
      videoHover: "",
      video: { tipo: "vimeo", id: "1038634019" },
    },
  ],

  /* ---------- NOSOTROS (about.html) ---------- */
  nosotros: {
    titulo: "El resultado, antes que el ruido.",
    parrafos: [
      "Casa productora audiovisual fundada en 2021 en Guadalajara, México. Contenido comercial para marcas globales — de la idea al master final.",
    ],
    servicios: [
      "Dirección", "Producción", "Cinematografía",
      "Aéreos", "Postproducción", "Color",
    ],
  },

  /* ---------- CONTACTO (contact.html) ---------- */
  contacto: {
    titulo: "Comencemos tu proyecto.",
    // ⚠️ Escribe aquí tu correo real de contacto:
    correo: "contacto@twowaves.mx",
    telefono: "",
    instagram: "https://www.instagram.com/twowaves.mx/",
    vimeo: "https://vimeo.com/twowavesfilms",
    direccion: "Guadalajara, México",
  },
};
