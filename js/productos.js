// ═══════════════════════════════════════════════
// PRODUCTOS.JS — Lógica de catálogo y carrito
// (el menú hamburguesa está en js/script.js)
// ═══════════════════════════════════════════════

// Limpieza de datos viejos de localStorage al entrar a la página
localStorage.removeItem('carrito');
localStorage.removeItem('contacto_nombre');
localStorage.removeItem('contacto_email');

// Convierte un precio en texto (ej: "$1.100") a número entero
function parsearPrecio(texto) {
    const limpio = texto.replace(/[$.\s]/g, '').replace(',', '.');
    const num = parseInt(limpio);
    return isNaN(num) ? 0 : num;
}

// Recalcula el total y la cantidad de items, y muestra/oculta el carrito flotante
function actualizarCarritoFlotante() {
    let totalPesos = 0, totalItems = 0;
    document.querySelectorAll('.categoria li').forEach(li => {
        const cantidad = parseInt(li.querySelector('.cantidad').textContent);
        if (cantidad > 0) {
            totalPesos += parsearPrecio(li.querySelector('.precio').textContent.trim()) * cantidad;
            totalItems += cantidad;
        }
    });
    const flotante = document.getElementById('carrito-flotante');
    document.getElementById('carrito-total-texto').textContent = '$' + totalPesos.toLocaleString('es-AR');
    document.getElementById('carrito-badge').textContent = totalItems;
    totalItems > 0 ? flotante.classList.add('visible') : flotante.classList.remove('visible');
}

// Genera el HTML de una fila de producto (nombre + precio + control de cantidad)
function crearFilaProducto(p) {
    const imgEsc = p.imagen.replace(/'/g, "\\'");
    const nombreEsc = p.nombre.replace(/'/g, "\\'");
    return `<li>
        <span class="nombre-producto" onclick="abrirModal('${imgEsc}','${nombreEsc}')">${p.nombre}</span>
        <span class="precio">${p.precio}</span>
        <div class="cantidad-control">
            <button onclick="cambiarCantidad(this,-1)">−</button>
            <span class="cantidad">0</span>
            <button onclick="cambiarCantidad(this,1)">+</button>
        </div>
    </li>`;
}

// Genera el HTML de una categoría completa (con o sin subcategorías)
function crearCategoria(cat) {
    let html = `<div class="categoria"><h2>${cat.categoria}</h2>`;
    if (cat.productos) {
        html += '<ul>' + cat.productos.map(crearFilaProducto).join('') + '</ul>';
    } else if (cat.subcategorias) {
        cat.subcategorias.forEach(sub => {
            html += `<h3>${sub.titulo}</h3><ul>` + sub.productos.map(crearFilaProducto).join('') + '</ul>';
        });
    }
    return html + '</div>';
}

// Carga productos.json de forma asíncrona y renderiza la lista completa
async function cargarProductos() {
    const contenedor = document.getElementById('productos-lista');
    try {
        const respuesta = await fetch('productos.json');
        const categorias = await respuesta.json();
        contenedor.innerHTML = categorias.map(crearCategoria).join('');
        localStorage.removeItem('carrito');
    } catch (error) {
        contenedor.innerHTML = '<p style="text-align:center;color:#c0392b;padding:2rem;">Error al cargar los productos. Recargá la página.</p>';
        console.error('Error cargando productos.json:', error);
    }
}

cargarProductos();

// Muestra un aviso tipo "toast" abajo de la pantalla
function mostrarAviso(mensaje) {
    const toast = document.getElementById('toast');
    toast.textContent = mensaje;
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), 3000);
}

// Suma o resta 1 a la cantidad de un producto (sin bajar de 0)
function cambiarCantidad(btn, delta) {
    const span = btn.parentElement.querySelector('.cantidad');
    let val = parseInt(span.textContent) + delta;
    if (val < 0) val = 0;
    span.textContent = val;
    actualizarCarritoFlotante();
}

// Abre el modal con la foto ampliada del producto
function abrirModal(src, titulo) {
    document.getElementById('modal-img').src = src;
    document.getElementById('modal-titulo').textContent = titulo;
    document.getElementById('modal').classList.add('activo');
}

// Cierra el modal de imagen
function cerrarModal() {
    document.getElementById('modal').classList.remove('activo');
}

// Cierra el modal con la tecla Escape
document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarModal(); });

// Junta los productos seleccionados, arma el mensaje y abre WhatsApp
function finalizarPedido() {
    const items = [];
    document.querySelectorAll('.categoria li').forEach(li => {
        const cantidadSpan = li.querySelector('.cantidad');
        const cantidad = parseInt(cantidadSpan.textContent);
        if (cantidad > 0) {
            items.push({ nombre: li.querySelector('.nombre-producto').textContent.trim(), precio: li.querySelector('.precio').textContent.trim(), cantidad });
            cantidadSpan.textContent = '0';
        }
    });
    if (items.length === 0) { mostrarAviso('Seleccioná al menos un producto antes de finalizar el pedido.'); return; }
    let msg = '¡Hola! Quiero hacer el siguiente pedido:%0A%0A';
    items.forEach(i => { msg += `• ${i.nombre} x${i.cantidad} (${i.precio})%0A`; });
    msg += '%0A¡Gracias!';
    window.open('https://wa.me/541124075797?text=' + msg, '_blank');
    localStorage.removeItem('carrito');
    actualizarCarritoFlotante();
}
