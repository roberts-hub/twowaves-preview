# Two Waves: sitio web (twowaves.mx)

Sitio estático en GitHub Pages, sin paso de build. Publicar es `git push origin main`: en ~1 minuto está en vivo en https://www.twowaves.mx. El repo es público: nunca subir contraseñas, tokens ni llaves.

## Flujo de trabajo (somos dos editando)

1. Antes de empezar: `git pull --no-edit --no-rebase origin main`.
2. Al terminar: `git add -A && git commit -m "mensaje claro" && git push origin main`.
3. Nunca `git push --force`. Si el push se rechaza: haz pull, resuelve y vuelve a hacer push.
4. Después de publicar, abre la página en vivo (con `?x=1` al final para saltar la caché) y revisa la consola del navegador.

## Dónde se edita

- Contenido (textos, proyectos, clientes, contacto, reseñas): `contenido.js`. Guía paso a paso en `GUIA-DE-EDICION.md`.
- Estilos: `css/estilo.css`. Lógica y animaciones: `js/app.js`.
- Páginas: `index.html`, `work.html`, `about.html`, `contact.html`, `mastermind.html`. La carpeta `onsite/` es otra landing (ONSITE) con sus propios css y js.

## Reglas que no se rompen

- Las páginas de proyecto (`<slug>.html`, una por proyecto, para SEO) se GENERAN. No se editan a mano: después de cambiar `proyectos` en `contenido.js` corre `node herramientas/generar-seo.js` (regenera esas páginas y `sitemap.xml`). Los `slug` reviven URLs del sitio anterior: no cambiarlos.
- Caché: cada vez que cambies CSS, JS o `contenido.js`, sube el número `?v=N` en `index.html`, `work.html`, `about.html`, `contact.html` y `herramientas/generar-seo.js` (todos al mismo número) y vuelve a correr el generador. En macOS, cambiando NN por el número nuevo:
  `sed -i '' -E 's/(estilo\.css|contenido\.js|app\.js)\?v=[0-9]+/\1?v=NN/g' index.html work.html about.html contact.html herramientas/generar-seo.js && node herramientas/generar-seo.js`
- Hero del Home: video propio en `assets/videos/` (`hero-sd.mp4` y `hero-hd.mp4`). No volver a usar el player de Vimeo ahí: tarda en arrancar.
- Imágenes: `pngquant` para PNG y redimensionar antes de subir. Recomprimir con `sips` puede empeorar el peso: compara antes de quedarte con el resultado.
- Formulario de contacto: envía a un Google Apps Script (`hojaCalculo` en `contenido.js`) que guarda el lead en una hoja y avisa por correo. No cambiar ese flujo sin avisar al otro.
- Textos del sitio en inglés. Sin guiones largos (—) ni guiones entre palabras en el copy nuevo.
- No tocar DNS ni registros de correo del dominio.
