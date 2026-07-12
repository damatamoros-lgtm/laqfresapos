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
// ==========================================
// BUSCAR PEDIDO POR ID
// ==========================================

function buscarPedidoPorId(idPedido) {

    return new Promise((resolve, reject) => {

        const callback = "respuestaPedido_" + Date.now();

        const script = document.createElement("script");

        window[callback] = function(respuesta) {

            resolve(respuesta);

            delete window[callback];
            script.remove();

        };

        script.onerror = function() {

            reject(new Error("No fue posible consultar el pedido."));

            delete window[callback];
            script.remove();

        };

        script.src =
            API_URL +
            "?id=" + encodeURIComponent(idPedido) +
            "&callback=" + callback;

        document.body.appendChild(script);

    });

}