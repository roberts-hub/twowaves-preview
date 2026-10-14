/**
 * THE CREATOR MASTERCLASS — Two Waves Films
 * Base de prospectos: recibe el cuestionario de unirse.html, guarda cada
 * registro como fila en la Google Sheet y avisa por correo.
 *
 * CÓMO ACTIVARLO (una sola vez, ~5 min):
 * 1. Abre la hoja "The Creator Masterclass — Prospectos (Two Waves)".
 * 2. Menú Extensiones → Apps Script.
 * 3. Borra el código de ejemplo y pega ESTE archivo completo. Guarda (💾).
 * 4. Implementar → Nueva implementación → engrane ⚙️ → "Aplicación web":
 *      - Ejecutar como: Yo (tu cuenta)
 *      - Quién tiene acceso: Cualquier persona
 *    → Implementar.
 * 5. Autoriza los permisos (hoja de cálculo + enviar correo). Si sale aviso:
 *    Avanzado → Ir a (no seguro) → Permitir. (Es tu propio script.)
 * 6. Copia la URL que termina en /exec y pásasela a Claude (o pégala en
 *    js/unirse.js → SHEETS_ENDPOINT y sube el cambio).
 */

// Correos que reciben el aviso de cada nuevo prospecto.
var NOTIFICAR = ["info@twowaves.mx"];

// Columnas (mismo orden que los encabezados de la hoja).
var COLUMNAS = ["fecha", "nombre", "correo", "whatsapp", "instagram", "sobre"];
var ETIQUETAS = {
  fecha: "Fecha",
  nombre: "Nombre",
  correo: "Correo",
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  sobre: "Sobre ti",
};

function doPost(e) { return registrar(e); }
function doGet(e) { return registrar(e); } // permite probar con la URL /exec?nombre=...

function registrar(e) {
  var hoja = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // Encabezados la primera vez (si la hoja está vacía).
  if (hoja.getLastRow() === 0) {
    hoja.appendRow(COLUMNAS.map(function (c) { return (ETIQUETAS[c] || c).toUpperCase(); }));
    hoja.setFrozenRows(1);
  }

  var datos = {};
  COLUMNAS.forEach(function (c) {
    datos[c] = ((e && e.parameter && e.parameter[c]) || "").toString().trim();
  });
  if (!datos.fecha) datos.fecha = new Date().toISOString();

  hoja.appendRow(COLUMNAS.map(function (c) { return datos[c]; }));

  // Aviso por correo.
  try {
    var cuerpo = COLUMNAS.map(function (c) {
      return (ETIQUETAS[c] || c) + ": " + (datos[c] || "-");
    }).join("\n");
    cuerpo += "\n\nVer todos los prospectos:\n" + SpreadsheetApp.getActiveSpreadsheet().getUrl();
    MailApp.sendEmail({
      to: NOTIFICAR.join(","),
      subject: "Nuevo prospecto - The Creator Masterclass (" + (datos.nombre || "sin nombre") + ")",
      body: cuerpo,
    });
  } catch (err) {}

  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
