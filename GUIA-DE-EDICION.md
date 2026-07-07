# 📝 Guía de edición de tu portafolio

Todo lo que necesitas editar vive en **UN solo archivo: `contenido.js`**.
No necesitas tocar el HTML, el CSS ni el JavaScript del motor.

## Cómo ver el sitio en tu computadora

1. Abre la app **Terminal** (⌘ + espacio, escribe "Terminal", Enter).
2. Pega esto y presiona Enter:
   ```
   cd ~/portafolio-productora && python3 -m http.server 8000
   ```
3. Abre tu navegador en: **http://localhost:8000**
4. Para detener el servidor: en la Terminal presiona `Ctrl + C`.

> ⚠️ Abre el sitio siempre con este mini-servidor (no haciendo doble clic
> en `index.html`), porque los videos y fuentes lo necesitan.

## El flujo de edición (siempre igual)

1. Abre la carpeta `portafolio-productora` y edita **`contenido.js`**
   con cualquier editor (TextEdit en modo texto plano, VS Code, Cursor…).
2. Guarda el archivo (⌘ + S).
3. Recarga el navegador (⌘ + R). Listo.

---

## 1. Cambiar el nombre de tu productora

En `contenido.js`, bloque `marca`:

```js
marca: {
  nombre: "VÉRTICE FILMS",   // ← escribe aquí tu nombre real
  eslogan: "Casa productora",
  ciudad: "Ciudad de México",
},
```

El nombre se actualiza automáticamente en el logo, el pie de página y las pestañas del navegador.

## 2. Agregar un proyecto nuevo (lo harás seguido)

En `contenido.js`, dentro de `proyectos: [ ... ]`, copia un bloque completo
(desde `{` hasta `},`) y pégalo **al inicio de la lista** para que salga primero:

```js
{
  titulo: "Nombre del proyecto",
  descripcion: "Texto corto que aparece bajo el video en el reproductor.",
  cliente: "Nombre del cliente",
  categoria: "Comercial",          // Comercial, Documental, Música, etc.
  anio: "2026",
  tamano: "grande",                // "grande" = ancho completo, "normal" = media columna
  destacado: true,                 // true = también sale en la portada
  miniatura: "assets/img/mi-foto.jpg",
  videoHover: "assets/videos/mi-preview.mp4",   // opcional, ver punto 4
  video: { tipo: "vimeo", id: "123456789" },    // ver punto 3
},
```

Para **eliminar** un proyecto: borra su bloque completo (de `{` a `},`).
Para **reordenar**: corta y pega los bloques en el orden que quieras.

## 3. Cargar los videos (3 opciones)

El campo `video` define qué se reproduce al hacer clic en la tarjeta:

| Dónde está tu video | Qué escribir |
|---|---|
| **Vimeo** (recomendado) | `video: { tipo: "vimeo", id: "123456789" }` |
| **YouTube** | `video: { tipo: "youtube", id: "AbCdEfGhIjK" }` |
| **Archivo propio** (.mp4) | `video: { tipo: "archivo", ruta: "assets/videos/mi-video.mp4" }` |

- **Vimeo**: el ID son los números al final del enlace. De `vimeo.com/987654321` el ID es `"987654321"`.
- **YouTube**: el ID es lo que va después de `watch?v=`. De `youtube.com/watch?v=dQw4w9WgXcQ` el ID es `"dQw4w9WgXcQ"`.
- **Archivo propio**: copia tu `.mp4` a la carpeta `assets/videos/` y escribe su ruta.

> 💡 Recomendación profesional: sube tus videos a **Vimeo** (como hace el sitio
> de referencia). Pesan mucho menos en tu hosting y se ven perfecto.

## 4. El video que se reproduce al pasar el mouse (hover)

**Ya funciona solo**: los proyectos con video de Vimeo reproducen su preview
automáticamente al pasar el mouse (usando el player de Vimeo en modo fondo).
No tienes que hacer nada.

Si quieres previews aún más instantáneos, puedes darle a un proyecto su
propio clip con el campo `videoHover` — un **.mp4 corto (5–10 s), sin audio
y ligero (< 5 MB)** que toma prioridad sobre el automático:

1. Exporta de tu editor un clip corto en 720p, sin audio.
2. Guárdalo en `assets/videos/`, por ejemplo `preview-mbmotos.mp4`.
3. Escribe: `videoHover: "assets/videos/preview-mbmotos.mp4",`

Si lo dejas vacío (`videoHover: ""`), la tarjeta hará zoom suave a la imagen — también se ve bien.

> 💡 Atajo con Vimeo (así lo hace el sitio de referencia): si tu cuenta de Vimeo
> es de pago (Starter/Standard/Pro), abre tu video en Vimeo → pestaña
> **Advanced** (o ⚙) → **Video file links** → copia el enlace del archivo
> de 720p y pégalo directo en `videoHover`.

## 4b. Cambiar el video del header (hero de la portada)

El hero usa el player de Vimeo en modo fondo (silencioso, en loop, sin controles).
En `contenido.js` → `portada` → `videoFondo`:

```js
videoFondo: { tipo: "vimeo", id: "997119368", aspecto: "3840x1920" },
```

1. Cambia el `id` por el de tu video (los números del enlace de Vimeo).
2. En `aspecto` pon las dimensiones reales del video (las ves en Vimeo →
   ⚙ → Video file links, o en tu editor). Si lo omites se asume 16:9.
3. Actualiza también `imagenFondo` con la miniatura del nuevo video para
   que se vea algo mientras el video carga.

> ⚠️ El modo fondo de Vimeo requiere que el video permita "embed" (Privacidad
> del video → Where can this be embedded → Anywhere) y funciona mejor con
> cuentas de pago. Si el video no arranca, revisa esa configuración.

## 5. Cambiar las miniaturas (fotos de cada proyecto)

1. Guarda tu imagen en `assets/img/` (JPG, 1200×800 px aprox., < 500 KB).
2. En el proyecto escribe: `miniatura: "assets/img/mi-foto.jpg",`
3. Las imágenes actuales que dicen "REEMPLAZA ESTA IMAGEN" son placeholders — bórralas cuando ya no las uses.

## 6. Cambiar textos de portada, nosotros y contacto

Todo está en `contenido.js`, en los bloques `portada`, `nosotros` y `contacto`.
Son textos entre comillas: cambia lo que está dentro de las comillas y guarda.

## 7. La banda de logos de clientes

La portada muestra una banda de logos blancos (como la página de referencia).
Para activarla:

1. Copia tus logos `.png` a la carpeta **`assets/img/logos/`**
   (solo PNG; de preferencia con fondo transparente).
2. Conviértelos a blanco puro con un comando en Terminal:
   ```
   cd ~/portafolio-productora && python3 herramientas/logos-a-blanco.py
   ```
   (Sube sombras y luces a blanco conservando la silueta. Si te falta
   Pillow: `python3 -m pip install pillow`. Los originales quedan
   respaldados en `assets/img/logos/originales/`.)
3. En `contenido.js`, bloque `clientes`, escribe la ruta de cada logo:
   ```js
   { nombre: "AION", logo: "assets/img/logos/aion.png" },
   ```

Reglas de la banda:
- **Solo aparecen los clientes que tienen `logo`** con archivo válido.
  Un cliente sin PNG simplemente no sale en la banda.
- Mientras NINGÚN cliente tenga logo, se muestran los nombres en texto
  (respaldo temporal).
- El sitio además fuerza los logos a blanco en pantalla, así que aunque
  te saltes el paso 2, un PNG transparente se verá blanco de todos modos.

## 8. Cambiar colores y tipografías de TODO el sitio

Único caso donde tocas otro archivo: **`css/estilo.css`**, solo el primer bloque `:root`:

```css
--fondo: #121211;      /* grafito cálido — fondo base */
--fondo-2: #1a1a18;    /* panel apenas más claro */
--profundo: #0b0b0a;   /* el negro más profundo (hero, pie) */
--texto: #e7e2d6;      /* hueso / alabastro — texto principal */
--acento: #b0a595;     /* greige muted — único acento */
--lino: #e5e0d5;       /* lino — fondo de las secciones claras */
```

Cambia los códigos de color (puedes elegirlos en https://htmlcolorcodes.com) y guarda.
La estética actual es tonos muted: grafito + hueso + greige. Si cambias colores,
mantenlos desaturados para conservar el look premium.

> 🎞 Las miniaturas se muestran en blanco y negro y recuperan su color al pasar
> el mouse. Es intencional: unifica thumbnails distintos y eleva el conjunto.
> Si no lo quieres, borra en `css/estilo.css` el bloque que empieza con
> `/* B/N por defecto → color al hover`.

## 8b. El formulario de contacto

- **Publicado en Netlify**: los mensajes llegan solos al panel de Netlify
  (Forms → contacto) y puedes configurar ahí que te lleguen por correo.
  No hay que programar nada.
- **En local o en otro hosting**: al enviar, se abre la app de correo del
  visitante con el mensaje ya escrito, dirigido a tu `contacto.correo`.
- Las 3 fases del proceso que se ven en About se editan en `contenido.js`
  → `nosotros.proceso` (paso, título y texto de cada una).

## 9. Errores comunes (si algo se rompe)

- **La página se ve en blanco** → casi siempre es una coma o comilla faltante en `contenido.js`. Deshaz tu último cambio (⌘ + Z), guarda y recarga.
- **Un video no carga** → revisa que el `id` o la `ruta` estén bien escritos y que el video en Vimeo/YouTube sea público o "no listado" (no privado).
- **El hover no reproduce video** → verifica que `videoHover` apunte a un `.mp4` real dentro de `assets/videos/`.
- Cada cambio queda guardado en git: si algo se rompe y no sabes por qué, en Terminal ejecuta `cd ~/portafolio-productora && git checkout -- contenido.js` para volver a la última versión buena que hayas confirmado.

## 10. Publicar el sitio en internet

El sitio es 100% estático: se puede subir gratis a **Netlify** (recomendado):

1. Crea cuenta en https://app.netlify.com
2. Arrastra la carpeta `portafolio-productora` completa a la zona "Drag and drop".
3. Netlify te da una URL al instante. Puedes conectar tu dominio propio en *Domain settings*.

Para actualizar el sitio publicado: repite el arrastre de la carpeta después de editar.
