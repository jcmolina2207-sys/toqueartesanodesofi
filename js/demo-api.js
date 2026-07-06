// ═══════════════════════════════════════════════
// DEMO-API.JS — Demostración de consumo de una API REST pública
// (requisito técnico del proyecto final; no reemplaza el catálogo real)
// ═══════════════════════════════════════════════

// Carga productos desde la Fake Store API (https://fakestoreapi.com)
async function cargarProductosDemo() {
    const contenedor = document.getElementById('demo-api-lista');
    try {
        const respuesta = await fetch('https://fakestoreapi.com/products?limit=8');
        if (!respuesta.ok) throw new Error('Respuesta no OK: ' + respuesta.status);
        const productos = await respuesta.json();
        contenedor.innerHTML = productos.map(crearCardDemo).join('');
    } catch (error) {
        contenedor.innerHTML = '<p style="text-align:center;color:#c0392b;padding:2rem;">No se pudieron cargar los productos de la API. Intentá de nuevo más tarde.</p>';
        console.error('Error cargando la API REST de demostración:', error);
    }
}

// Genera la tarjeta (card) de un producto: imagen, título y precio
function crearCardDemo(p) {
    return `<div class="demo-api-card">
        <img src="${p.image}" alt="${p.title}">
        <h3>${p.title}</h3>
        <span class="demo-api-precio">US$ ${p.price}</span>
    </div>`;
}

cargarProductosDemo();
