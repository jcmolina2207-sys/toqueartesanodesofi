# Toque Artesano de Sofi

Sitio web para el emprendimiento artesanal **Toque Artesano de Sofi**, donde se muestran productos, ofertas de la semana y un formulario de contacto para consultas.

## Descripción

Una tienda online con páginas de inicio, catálogo de productos y contacto. El diseño usa una paleta de colores azul pastel con detalles en tonos oscuros, pensada para transmitir calidez y confianza. Los productos se cargan dinámicamente desde un archivo JSON y el carrito persiste entre sesiones con LocalStorage.

## Páginas

- **index.html** — Página principal con logo, navegación, oferta destacada y footer con redes sociales.
- **pages/productos.html** — Catálogo de productos con carrito interactivo.
- **pages/contacto.html** — Formulario de contacto con validación y LocalStorage.
- **pages/productos.json** — Base de datos de productos consumida con fetch.

## Tecnologías utilizadas

- HTML5 semántico
- CSS3 (Flexbox y Grid)
- JavaScript (ES6+): fetch, async/await, DOM dinámico, LocalStorage
- Google Fonts (Lato)
- Formspree (backend del formulario de contacto)
- GitHub Pages (hosting)

## Funcionalidades JavaScript

### Formulario de contacto (`contacto.html`)
- Validación de campos en tiempo real: los errores desaparecen mientras el usuario escribe.
- Envío asíncrono con `fetch` + `async/await` a Formspree sin recargar la página.
- **LocalStorage**: al enviar el formulario con éxito, guarda el nombre y email del usuario. La próxima vez que visita la página, los campos aparecen pre-completados.

### Catálogo de productos (`productos.html`)
- **fetch + async/await**: los productos se cargan desde `productos.json` al entrar a la página. El HTML no tiene productos hardcodeados; JS genera todas las tarjetas dinámicamente.
- **LocalStorage**: el carrito persiste entre sesiones. Si el usuario agrega productos y cierra la pestaña, al volver las cantidades siguen guardadas. Al finalizar el pedido, el carrito se limpia automáticamente.
- Modal de imagen al hacer clic en cada producto (sin librerías externas).
- Botón "Finalizar pedido" que arma el mensaje y abre WhatsApp con el pedido pre-cargado.
- Toast de notificación que reemplaza los `alert()` del navegador.

## Cómo probarlo

> **Importante:** la página de productos usa `fetch` para cargar el JSON, por lo que **no funciona abriéndola directamente como archivo** (`file://`). Es necesario usar un servidor local.

### Opción recomendada — Live Server (VS Code)
1. Abrir la carpeta del proyecto en VS Code.
2. Hacer clic derecho sobre `index.html` → **Open with Live Server**.
3. El sitio abre en `http://localhost:5500`.

### Para probar LocalStorage del formulario
1. Ir a `pages/contacto.html`.
2. Completar y enviar el formulario.
3. Recargar la página: nombre y email deben aparecer pre-completados.

### Para probar LocalStorage del carrito
1. Ir a `pages/productos.html`.
2. Agregar cantidades a algunos productos.
3. Cerrar la pestaña y volver a abrir la página: las cantidades deben estar restauradas.

### Para probar fetch y renderizado dinámico
1. Abrir las DevTools del navegador (F12) → pestaña **Network**.
2. Recargar `pages/productos.html`.
3. Verificar que aparece una solicitud a `productos.json` con estado 200.

## Autor

Proyecto desarrollado por Juan Molina como trabajo práctico del curso de Frontend.
