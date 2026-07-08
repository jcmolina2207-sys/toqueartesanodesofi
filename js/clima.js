// ═══════════════════════════════════════════════
// CLIMA.JS — Mensaje dinámico en el home según el clima real
// Consume la API pública de Open-Meteo (sin necesidad de API key)
// ═══════════════════════════════════════════════

// Coordenadas de Berazategui, Buenos Aires
const LAT_BERAZATEGUI = -34.76;
const LON_BERAZATEGUI = -58.21;

// Traduce el código de clima de Open-Meteo (estándar WMO) a un mensaje corto con onda
function obtenerMensajePorClima(codigo, temperatura) {
    const temp = Math.round(temperatura);

    if (codigo === 0) {
        return `☀️ ${temp}°C — día soleado, ¡pedí algo fresquito!`;
    }
    if ([1, 2, 3].includes(codigo)) {
        return `☁️ ${temp}°C — buen día para un cafecito con alfajores`;
    }
    if ([45, 48].includes(codigo)) {
        return `🌫️ Niebla en la zona — ¡igual llegamos con tu pedido!`;
    }
    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(codigo)) {
        return `☔ Día de lluvia — ideal para churros con dulce de leche`;
    }
    if ([71, 73, 75, 77, 85, 86].includes(codigo)) {
        return `🧣 Frío de novela — pedí algo calentito`;
    }
    if ([95, 96, 99].includes(codigo)) {
        return `⛈️ Tormenta en la zona — los pedidos pueden demorar más`;
    }
    return `¡Bienvenido! Pedí tu producto artesano favorito 🥐`;
}

// Pide el clima actual y actualiza el mensaje en el home
async function mostrarMensajeClima() {
    const contenedor = document.getElementById('mensaje-clima');
    if (!contenedor) return;

    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT_BERAZATEGUI}&longitude=${LON_BERAZATEGUI}&current=temperature_2m,weather_code`;
        const respuesta = await fetch(url);
        if (!respuesta.ok) throw new Error('Respuesta no OK: ' + respuesta.status);

        const datos = await respuesta.json();
        const codigo = datos.current.weather_code;
        const temperatura = datos.current.temperature_2m;

        contenedor.textContent = obtenerMensajePorClima(codigo, temperatura);
    } catch (error) {
        // Si falla la API (sin internet, servicio caído, etc.) se deja el mensaje por defecto del HTML
        console.error('No se pudo obtener el clima:', error);
    }
}

mostrarMensajeClima();
