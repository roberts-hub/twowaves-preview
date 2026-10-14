/**
 * THE CREATOR MASTERCLASS — Two Waves Films
 * Base de prospectos: recibe el cuestionario de unirse.html, guarda cada
 * registro como fila en la Google Sheet (con formato bonito y filtrable)
 * y avisa por correo.
 *
 * CÓMO ACTIVARLO (una sola vez, ~5 min):
 * 1. Abre la hoja "The Creator Masterclass — Prospectos (Two Waves)".
 * 2. Menú Extensiones → Apps Script.
 * 3. Borra el código de ejemplo y pega ESTE archivo completo. Guarda (💾).
 * 4. (Opcional, para ver el formato ya) Arriba, elige la función
 *    "configurarHoja" y dale Run. Autoriza los permisos. La hoja queda
 *    con encabezado, filtros, colores y el menú desplegable de Estado.
 * 5. Implementar → Nueva implementación → engrane ⚙️ → "Aplicación web":
 *      - Ejecutar como: Yo (tu cuenta)
 *      - Quién tiene acceso: Cualquier persona
 *    → Implementar → autoriza.
 * 6. Copia la URL que termina en /exec y pásasela a Claude (o pégala en
 *    js/unirse.js → SHEETS_ENDPOINT y sube el cambio).
 *
 * Al abrir la hoja verás un menú "Two Waves" para re-aplicar el formato
 * cuando quieras.
 */

// Correos que reciben el aviso de cada nuevo prospecto.
var NOTIFICAR = ["info@twowaves.mx"];

// Columnas que llegan del formulario (orden = columnas A..F de la hoja).
var COLUMNAS = ["fecha", "nombre", "instagram", "whatsapp", "correo", "sobre"];

// Encabezados completos de la hoja (incluye ESTADO y NOTAS, que llenas tú).
var ENCABEZADOS = ["FECHA", "NOMBRE", "INSTAGRAM", "WHATSAPP", "CORREO", "SOBRE TI", "ESTADO", "NOTAS"];
var ESTADOS = ["Nuevo", "Contactado", "Seleccionado", "Descartado"];
var MAX = 2000;

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Two Waves")
    .addItem("Dar formato a la hoja", "configurarHoja")
    .addToUi();
}

function doPost(e) { return registrar(e); }
function doGet(e) { return registrar(e); } // prueba con /exec?nombre=...

function registrar(e) {
  var hoja = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // Formatea la hoja la primera vez (sin pasos manuales).
  var props = PropertiesService.getDocumentProperties();
  if (props.getProperty("formateada") !== "1") {
    configurarHoja();
    props.setProperty("formateada", "1");
  }

  var datos = {};
  COLUMNAS.forEach(function (c) {
    datos[c] = ((e && e.parameter && e.parameter[c]) || "").toString().trim();
  });
  if (!datos.fecha) datos.fecha = new Date().toISOString();

  // Fila nueva (columnas A..F; ESTADO y NOTAS quedan vacías para ti).
  hoja.appendRow(COLUMNAS.map(function (c) { return datos[c]; }));

  // Aviso por correo.
  try {
    var cuerpo =
      "NOMBRE: " + (datos.nombre || "-") + "\n" +
      "INSTAGRAM: " + (datos.instagram || "-") + "\n" +
      "WHATSAPP: " + (datos.whatsapp || "-") + "\n" +
      "CORREO: " + (datos.correo || "-") + "\n" +
      "SOBRE TI: " + (datos.sobre || "-") + "\n" +
      "FECHA: " + (datos.fecha || "-") + "\n\n" +
      "Ver todos los prospectos:\n" + SpreadsheetApp.getActiveSpreadsheet().getUrl();
    MailApp.sendEmail({
      to: NOTIFICAR.join(","),
      subject: "Nuevo prospecto - The Creator Masterclass (" + (datos.nombre || "sin nombre") + ")",
      body: cuerpo,
    });
  } catch (err) {}

  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Da formato a la hoja: encabezado, filtros, filas alternadas, anchos,
 * menú desplegable de ESTADO y colores por estado. Idempotente.
 */
function configurarHoja() {
  var h = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var nCols = ENCABEZADOS.length;

  // Encabezado
  h.getRange(1, 1, 1, nCols)
    .setValues([ENCABEZADOS])
    .setFontWeight("bold")
    .setFontColor("#eae0c5")
    .setBackground("#0e0e0d")
    .setVerticalAlignment("middle")
    .setHorizontalAlignment("left");
  h.setFrozenRows(1);
  h.setRowHeight(1, 36);

  // Anchos de columna (A..H)
  var widths = [150, 160, 150, 150, 220, 340, 130, 260];
  for (var i = 0; i < widths.length; i++) h.setColumnWidth(i + 1, widths[i]);

  // "Sobre ti" y "Notas" con ajuste de texto
  h.getRange(2, 6, MAX - 1, 1).setWrap(true);
  h.getRange(2, 8, MAX - 1, 1).setWrap(true);

  // Filas alternadas (banding) en el área de datos
  h.getBandings().forEach(function (b) { b.remove(); });
  h.getRange(2, 1, MAX - 1, nCols)
    .applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, false, false);

  // Filtro
  if (h.getFilter()) h.getFilter().remove();
  h.getRange(1, 1, MAX, nCols).createFilter();

  // Menú desplegable en ESTADO (columna G)
  var reglaEstado = SpreadsheetApp.newDataValidation()
    .requireValueInList(ESTADOS, true)
    .setAllowInvalid(false)
    .build();
  h.getRange(2, 7, MAX - 1, 1).setDataValidation(reglaEstado);

  // Colores por estado (formato condicional en G)
  var rangoG = [h.getRange(2, 7, MAX - 1, 1)];
  function regla(texto, bg, fg) {
    return SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo(texto)
      .setBackground(bg)
      .setFontColor(fg)
      .setRanges(rangoG)
      .build();
  }
  h.setConditionalFormatRules([
    regla("Seleccionado", "#17331f", "#9ae6b4"),
    regla("Contactado", "#33301a", "#ecd98f"),
    regla("Descartado", "#2a2a2a", "#9a9a9a"),
    regla("Nuevo", "#1b2838", "#9ec5ff"),
  ]);
}
