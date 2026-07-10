// ==========================================
// CONEXIÓN CON GOOGLE SHEETS
// ==========================================

const API_URL =
    "https://script.google.com/macros/s/AKfycbylbStuOx4asvi3hy2bMrV91zY2mWt8Ap2Wm1Kh2fBwAwIV1n132L69y2q0RlGgIlXgfg/exec";

async function guardarPedidoEnSheets(datosPedido) {

    await fetch(API_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(datosPedido)
    });

    return true;
}