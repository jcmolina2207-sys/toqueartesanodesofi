// ═══════════════════════════════════════════════
// SCRIPT COMPARTIDO — Toque Artesano de Sofi
// Se usa en las 3 páginas (index, productos, contacto)
// ═══════════════════════════════════════════════

// Menú hamburguesa (mobile)
document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('nav-principal');
    if (toggle && nav) {
        toggle.addEventListener('click', function () {
            nav.classList.toggle('abierto');
        });
    }
});
