// ═══════════════════════════════════════════════
// CONTACTO.JS — Lógica del formulario de contacto
// (el menú hamburguesa está en js/script.js)
// ═══════════════════════════════════════════════

// Limpieza de datos viejos de localStorage al entrar a la página
localStorage.removeItem('contacto_nombre');
localStorage.removeItem('contacto_email');

const form = document.getElementById('formulario-contacto');

// Muestra un aviso tipo "toast" abajo de la pantalla
function mostrarAviso(mensaje) {
    const toast = document.getElementById('toast');
    toast.textContent = mensaje;
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), 3000);
}

// Envío del formulario con validación y fetch a Formspree
form.addEventListener('submit', async function (evento) {
    evento.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();
    let hayErrores = false;

    // Validaciones por campo
    if (nombre === '') { mostrarError('nombre'); hayErrores = true; } else { ocultarError('nombre'); }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { mostrarError('email'); hayErrores = true; } else { ocultarError('email'); }
    if (telefono !== '' && !/^\d+$/.test(telefono)) { mostrarError('telefono'); hayErrores = true; } else { ocultarError('telefono'); }
    if (mensaje === '') { mostrarError('mensaje'); hayErrores = true; } else { ocultarError('mensaje'); }

    if (!hayErrores) {
        const btn = form.querySelector('.btn-enviar');
        btn.disabled = true; btn.textContent = 'Enviando…';
        try {
            const respuesta = await fetch('https://formspree.io/f/maqvlnvj', {
                method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' }
            });
            if (respuesta.ok) {
                form.reset();
                document.getElementById('exito').style.display = 'block';
                setTimeout(() => { document.getElementById('exito').style.display = 'none'; }, 5000);
            } else { mostrarAviso('Hubo un error al enviar el mensaje. Intentá de nuevo.'); }
        } catch (err) { mostrarAviso('Error de conexión. Verificá tu internet e intentá de nuevo.'); }
        finally { btn.disabled = false; btn.textContent = 'Enviar mensaje'; }
    }
});

// Helpers para mostrar/ocultar mensajes de error por campo
function mostrarError(campo) { document.getElementById(campo).classList.add('error'); document.getElementById('error-' + campo).style.display = 'block'; }
function ocultarError(campo) { document.getElementById(campo).classList.remove('error'); document.getElementById('error-' + campo).style.display = 'none'; }

// Validación en tiempo real (mientras el usuario escribe)
document.getElementById('nombre').addEventListener('input', function () { if (this.value.trim() !== '') ocultarError('nombre'); });
document.getElementById('email').addEventListener('input', function () { if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value.trim())) ocultarError('email'); });
document.getElementById('telefono').addEventListener('input', function () { const v = this.value.trim(); if (v === '' || /^\d+$/.test(v)) ocultarError('telefono'); else mostrarError('telefono'); });
document.getElementById('mensaje').addEventListener('input', function () { if (this.value.trim() !== '') ocultarError('mensaje'); });
