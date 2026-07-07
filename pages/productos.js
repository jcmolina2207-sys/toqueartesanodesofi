// ═══════════════════════════════════════════════
// PRODUCTOS.JS — Catálogo en cards + carrito persistente
// (el menú hamburguesa está en js/script.js)
// ═══════════════════════════════════════════════

// Limpieza de datos viejos de contacto (no relacionados al carrito)
localStorage.removeItem('contacto_nombre');
localStorage.removeItem('contacto_email');

// El carrito vive en este objeto durante la sesión, y se
// guarda/lee de localStorage para persistir entre recargas.
// Estructura: { "Nombre del producto": { nombre, precio, imagen, cantidad } }
let carrito = {};

// Carga el carrito guardado (si existe) al entrar a la página
function cargarCarritoDesdeStorage() {
    try {
        const guardado = localStorage.getItem('carrito');
        carrito = guardado ? JSON.parse(guardado) : {};
    } catch (error) {
        console.error('Error leyendo el carrito guardado:', error);
        carrito = {};
    }
}

// Guarda el estado actual del carrito en localStorage
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Escapa comillas y símbolos especiales para usar en atributos HTML
function escapeHtml(texto) {
    return String(texto)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

// Convierte un precio en texto (ej: "$1.100") a número entero
function parsearPrecio(texto) {
    const limpio = String(texto).replace(/[$.\s]/g, '').replace(',', '.');
    const num = parseInt(limpio);
    return isNaN(num) ? 0 : num;
}

// Muestra un aviso tipo "toast" abajo de la pantalla
function mostrarAviso(mensaje) {
    const toast = document.getElementById('toast');
    toast.textContent = mensaje;
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), 3000);
}

// ═══════════════════════════════
// RENDERIZADO DEL CATÁLOGO
// ═══════════════════════════════

// Genera la tarjeta (card) de un producto: imagen, nombre, precio y control de cantidad
function crearTarjetaProducto(p) {
    const cantidadActual = carrito[p.nombre] ? carrito[p.nombre].cantidad : 0;
    return `<div class="producto-card" data-nombre="${escapeHtml(p.nombre)}" data-precio="${escapeHtml(p.precio)}" data-imagen="${escapeHtml(p.imagen)}">
        <img src="${p.imagen}" alt="${escapeHtml(p.nombre)}" class="producto-img">
        <div class="producto-info">
            <span class="producto-nombre">${p.nombre}</span>
            <span class="producto-precio">${p.precio}</span>
        </div>
        <div class="cantidad-control">
            <button class="btn-restar" aria-label="Quitar uno">−</button>
            <span class="cantidad">${cantidadActual}</span>
            <button class="btn-sumar" aria-label="Agregar uno">+</button>
        </div>
    </div>`;
}

// Genera la sección completa de una categoría (con o sin subcategorías)
function crearSeccionCategoria(cat) {
    let html = `<section class="categoria-seccion"><h2>${cat.categoria}</h2>`;
    if (cat.productos) {
        html += `<div class="producto-grid">${cat.productos.map(crearTarjetaProducto).join('')}</div>`;
    } else if (cat.subcategorias) {
        cat.subcategorias.forEach(sub => {
            html += `<h3>${sub.titulo}</h3><div class="producto-grid">${sub.productos.map(crearTarjetaProducto).join('')}</div>`;
        });
    }
    return html + '</section>';
}

// Carga productos.json de forma asíncrona y renderiza el catálogo completo
async function cargarProductos() {
    const contenedor = document.getElementById('productos-lista');
    try {
        const respuesta = await fetch('productos.json');
        const categorias = await respuesta.json();
        contenedor.innerHTML = categorias.map(crearSeccionCategoria).join('');
        actualizarCarritoFlotante();
    } catch (error) {
        contenedor.innerHTML = '<p style="text-align:center;color:#c0392b;padding:2rem;">Error al cargar los productos. Recargá la página.</p>';
        console.error('Error cargando productos.json:', error);
    }
}

cargarCarritoDesdeStorage();
cargarProductos();

// ═══════════════════════════════
// CANTIDAD DESDE EL CATÁLOGO (grilla de cards)
// ═══════════════════════════════

// Delegación de eventos: un solo listener para todas las cards, aunque se regeneren
document.getElementById('productos-lista').addEventListener('click', function (e) {
    const card = e.target.closest('.producto-card');
    if (!card) return;
    const nombre = card.dataset.nombre;
    const precio = card.dataset.precio;
    const imagen = card.dataset.imagen;

    if (e.target.classList.contains('btn-sumar')) {
        cambiarCantidadGrid(nombre, precio, imagen, 1, card);
    } else if (e.target.classList.contains('btn-restar')) {
        cambiarCantidadGrid(nombre, precio, imagen, -1, card);
    } else if (e.target.classList.contains('producto-img')) {
        abrirModal(imagen, nombre);
    }
});

// Suma o resta 1 a la cantidad de un producto desde la card del catálogo
function cambiarCantidadGrid(nombre, precio, imagen, delta, card) {
    const actual = carrito[nombre] ? carrito[nombre].cantidad : 0;
    let nueva = actual + delta;
    if (nueva < 0) nueva = 0;

    if (nueva === 0) {
        delete carrito[nombre];
    } else {
        carrito[nombre] = { nombre, precio, imagen, cantidad: nueva };
    }
    guardarCarrito();
    card.querySelector('.cantidad').textContent = nueva;
    actualizarCarritoFlotante();
}

// Recorre todas las cards visibles y actualiza su cantidad según el carrito actual
// (se usa después de editar o eliminar algo desde la vista de carrito)
function sincronizarCantidadesEnGrid() {
    document.querySelectorAll('#productos-lista .producto-card').forEach(card => {
        const nombre = card.dataset.nombre;
        const cantidad = carrito[nombre] ? carrito[nombre].cantidad : 0;
        card.querySelector('.cantidad').textContent = cantidad;
    });
}

// Recalcula el total y la cantidad de items, y muestra/oculta el carrito flotante
function actualizarCarritoFlotante() {
    let totalPesos = 0, totalItems = 0;
    Object.values(carrito).forEach(item => {
        totalPesos += parsearPrecio(item.precio) * item.cantidad;
        totalItems += item.cantidad;
    });
    const flotante = document.getElementById('carrito-flotante');
    document.getElementById('carrito-total-texto').textContent = '$' + totalPesos.toLocaleString('es-AR');
    document.getElementById('carrito-badge').textContent = totalItems;
    totalItems > 0 ? flotante.classList.add('visible') : flotante.classList.remove('visible');
}

// ═══════════════════════════════
// MODAL DE IMAGEN DE PRODUCTO
// ═══════════════════════════════

function abrirModal(src, titulo) {
    document.getElementById('modal-img').src = src;
    document.getElementById('modal-titulo').textContent = titulo;
    document.getElementById('modal').classList.add('activo');
}

function cerrarModal() {
    document.getElementById('modal').classList.remove('activo');
}

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        cerrarModal();
        cerrarCarritoModal();
    }
});

// ═══════════════════════════════
// VISTA DE CARRITO (edición y eliminación de productos)
// ═══════════════════════════════

// Genera la fila de un producto dentro de la vista de carrito
function crearFilaCarrito(item) {
    return `<div class="carrito-item" data-nombre="${escapeHtml(item.nombre)}" data-precio="${escapeHtml(item.precio)}" data-imagen="${escapeHtml(item.imagen)}">
        <img src="${item.imagen}" alt="${escapeHtml(item.nombre)}">
        <div class="carrito-item-info">
            <span class="carrito-item-nombre">${item.nombre}</span>
            <span class="carrito-item-precio">${item.precio} c/u</span>
        </div>
        <div class="cantidad-control">
            <button class="btn-restar-carrito" aria-label="Quitar uno">−</button>
            <span class="cantidad">${item.cantidad}</span>
            <button class="btn-sumar-carrito" aria-label="Agregar uno">+</button>
        </div>
        <button class="carrito-item-eliminar" title="Eliminar producto">🗑</button>
    </div>`;
}

// Vuelve a dibujar el contenido de la vista de carrito (items + total)
function renderCarritoModal() {
    const contenedor = document.getElementById('carrito-items');
    const items = Object.values(carrito);

    contenedor.innerHTML = items.length === 0
        ? '<p class="carrito-vacio">Tu carrito está vacío.</p>'
        : items.map(crearFilaCarrito).join('');

    let total = 0;
    items.forEach(item => total += parsearPrecio(item.precio) * item.cantidad);
    document.getElementById('carrito-modal-total').textContent = '$' + total.toLocaleString('es-AR');
}

function abrirCarritoModal() {
    renderCarritoModal();
    document.getElementById('modal-carrito').classList.add('activo');
}

function cerrarCarritoModal() {
    document.getElementById('modal-carrito').classList.remove('activo');
}

// Cierra la vista de carrito al hacer clic fuera del contenido
function cerrarCarritoModalFondo(evento) {
    if (evento.target.id === 'modal-carrito') cerrarCarritoModal();
}

// Delegación de eventos para sumar, restar o eliminar productos dentro del carrito
document.getElementById('carrito-items').addEventListener('click', function (e) {
    const fila = e.target.closest('.carrito-item');
    if (!fila) return;
    const nombre = fila.dataset.nombre;
    const precio = fila.dataset.precio;
    const imagen = fila.dataset.imagen;

    if (e.target.classList.contains('btn-sumar-carrito')) {
        cambiarCantidadCarrito(nombre, precio, imagen, 1);
    } else if (e.target.classList.contains('btn-restar-carrito')) {
        cambiarCantidadCarrito(nombre, precio, imagen, -1);
    } else if (e.target.classList.contains('carrito-item-eliminar')) {
        delete carrito[nombre];
        guardarCarrito();
        renderCarritoModal();
        actualizarCarritoFlotante();
        sincronizarCantidadesEnGrid();
    }
});

// Suma o resta 1 a la cantidad de un producto desde la vista de carrito
function cambiarCantidadCarrito(nombre, precio, imagen, delta) {
    const actual = carrito[nombre] ? carrito[nombre].cantidad : 0;
    let nueva = actual + delta;

    if (nueva < 1) {
        delete carrito[nombre];
    } else {
        carrito[nombre] = { nombre, precio, imagen, cantidad: nueva };
    }
    guardarCarrito();
    renderCarritoModal();
    actualizarCarritoFlotante();
    sincronizarCantidadesEnGrid();
}

// ═══════════════════════════════
// FINALIZAR PEDIDO (envío por WhatsApp)
// ═══════════════════════════════

function finalizarPedido() {
    const items = Object.values(carrito);
    if (items.length === 0) {
        mostrarAviso('Tu carrito está vacío. Agregá algún producto antes de finalizar el pedido.');
        return;
    }
    let msg = '¡Hola! Quiero hacer el siguiente pedido:%0A%0A';
    items.forEach(i => { msg += `• ${i.nombre} x${i.cantidad} (${i.precio})%0A`; });
    msg += '%0A¡Gracias!';
    window.open('https://wa.me/541124075797?text=' + msg, '_blank');

    // El pedido ya se envió: se vacía el carrito para el próximo pedido
    carrito = {};
    guardarCarrito();
    actualizarCarritoFlotante();
    sincronizarCantidadesEnGrid();
    renderCarritoModal();
    cerrarCarritoModal();
}
