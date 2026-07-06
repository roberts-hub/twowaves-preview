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
    nombre: "VÉRTICE FILMS",          // Nombre de tu casa productora
    eslogan: "Casa productora",
    ciudad: "Ciudad de México",
  },

  /* ---------- PORTADA (index.html) ---------- */
  portada: {
    tituloLinea1: "Historias que",
    tituloAcento: "se sienten",        // Se muestra en cursiva serif
    tituloLinea2: "antes de entenderse.",
    subtitulo: "Producción audiovisual para marcas que quieren dejar huella. Comerciales, contenido y cine publicitario.",
    // Video de fondo del hero. Puede ser una ruta local ("assets/videos/reel.mp4")
    // o un enlace directo a un .mp4. Déjalo en "" para usar solo la imagen.
    videoFondo: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    imagenFondo: "assets/img/poster-hero.svg",
  },

  /* ---------- CLIENTES (marquesina) ---------- */
  clientes: [
    "Cliente Uno", "Marca Dos", "Estudio Tres", "Grupo Cuatro",
    "Casa Cinco", "Firma Seis", "Agencia Siete", "Hotel Ocho",
  ],

  /* ---------- PROYECTOS ----------
     Cada proyecto es un bloque { ... }. Para AGREGAR uno, copia
     un bloque completo (de { a },) y pégalo al inicio de la lista.
     Para QUITARLO, borra el bloque completo.

     Campos:
       titulo      → nombre del proyecto
       cliente     → marca o cliente
       categoria   → ej. "Comercial", "Documental", "Música"
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
      titulo: "Amanecer",
      cliente: "Marca Dos",
      categoria: "Comercial",
      anio: "2026",
      tamano: "grande",
      destacado: true,
      miniatura: "assets/img/proyecto-01.svg",
      videoHover: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      video: { tipo: "archivo", ruta: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
    },
    {
      titulo: "Ruta 57",
      cliente: "Grupo Cuatro",
      categoria: "Documental",
      anio: "2026",
      tamano: "normal",
      destacado: true,
      miniatura: "assets/img/proyecto-02.svg",
      videoHover: "",
      video: { tipo: "vimeo", id: "76979871" },
    },
    {
      titulo: "Piel de neón",
      cliente: "Estudio Tres",
      categoria: "Video musical",
      anio: "2025",
      tamano: "normal",
      destacado: true,
      miniatura: "assets/img/proyecto-03.svg",
      videoHover: "",
      video: { tipo: "youtube", id: "aqz-KE-bpKQ" },
    },
    {
      titulo: "La mesa larga",
      cliente: "Casa Cinco",
      categoria: "Contenido",
      anio: "2025",
      tamano: "normal",
      destacado: false,
      miniatura: "assets/img/proyecto-04.svg",
      videoHover: "",
      video: { tipo: "vimeo", id: "76979871" },
    },
    {
      titulo: "Kilómetro cero",
      cliente: "Firma Seis",
      categoria: "Comercial",
      anio: "2025",
      tamano: "normal",
      destacado: false,
      miniatura: "assets/img/proyecto-05.svg",
      videoHover: "",
      video: { tipo: "vimeo", id: "76979871" },
    },
    {
      titulo: "Habitación 214",
      cliente: "Hotel Ocho",
      categoria: "Branded film",
      anio: "2024",
      tamano: "grande",
      destacado: false,
      miniatura: "assets/img/proyecto-06.svg",
      videoHover: "",
      video: { tipo: "youtube", id: "aqz-KE-bpKQ" },
    },
  ],

  /* ---------- NOSOTROS (about.html) ---------- */
  nosotros: {
    titulo: "Producimos con intención.",
    parrafos: [
      "Somos una casa productora independiente. Creemos que una buena idea merece una ejecución impecable: dirección, foto, arte y post bajo un mismo techo.",
      "Trabajamos con marcas, agencias y artistas que buscan piezas con punto de vista — no contenido de relleno.",
    ],
    servicios: [
      "Dirección", "Producción ejecutiva", "Cinematografía",
      "Postproducción", "Color", "Diseño sonoro",
    ],
  },

  /* ---------- CONTACTO (contact.html) ---------- */
  contacto: {
    titulo: "Hagamos algo que valga la pena ver.",
    correo: "hola@tucasaproductora.com",
    telefono: "+52 55 0000 0000",
    instagram: "https://instagram.com/tucasaproductora",
    vimeo: "https://vimeo.com/tucasaproductora",
    direccion: "Ciudad de México, MX",
  },
};
