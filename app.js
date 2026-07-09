// ================================
// VARIABLES
// ================================

let pedido = [];

let indiceEditando = null;

let numeroPedido = Number(localStorage.getItem("numeroPedido")) || 1;

const comboProducto = document.getElementById("producto");
const precio = document.getElementById("precio");
const ingredientes = document.getElementById("ingredientes");

// ================================
// CREA UN SELECT
// ================================

function crearSelect(titulo, lista, cantidad){

    let html = "";

    for(let i=1;i<=cantidad;i++){

        html += `
            <label>${titulo} ${i}</label>

            <select class="${titulo}">

                <option value="">Seleccione...</option>

                ${lista.map(x=>`<option>${x}</option>`).join("")}

            </select>

            <br><br>
        `;

    }

    return html;

}

// ================================
// CAMBIO DE PRODUCTO
// ================================

comboProducto.addEventListener("change",()=>{

    const producto = datos.productos.find(x=>x.nombre===comboProducto.value);

    if(!producto){

        precio.textContent="$0";
        ingredientes.innerHTML="";
        return;

    }

    precio.textContent="$"+producto.precio.toLocaleString("es-CO");

    let html="";

    html += crearSelect("fruta",datos.frutas,producto.frutas);

html += crearSelect("salsa",datos.salsas,producto.salsas);

html += crearSelect("clasico",datos.clasicos,producto.clasicos);

html += crearSelect("premium",datos.premium,producto.premium);

    if(producto.queso){

        html += `
            <label>
                <input type="checkbox" id="queso">
                Agregar queso
            </label>

            <br><br>
        `;

    }

html += `
<hr>

<h3>Adicionales</h3>

<div id="listaAdicionales"></div>

<button type="button" id="btnAgregarAdicional">
+ Agregar adicional
</button>

<br><br>

<label>Observaciones</label><br>

<textarea id="observaciones" rows="3"></textarea>
`;

    ingredientes.innerHTML=html;

});
// ==========================================
// AGREGAR ADICIONAL
// ==========================================

document.addEventListener("click", function(e){

    if(e.target.id!="btnAgregarAdicional") return;

    const div=document.getElementById("listaAdicionales");

    div.innerHTML += `

    <div style="margin-bottom:10px;">

        <select class="tipoAdicional">

            <option value="">Tipo</option>

            ${datos.tiposAdicionales.map(x=>`<option>${x}</option>`).join("")}

        </select>

        <select class="detalleAdicional">

            <option value="">Detalle</option>

        </select>

        <input
            type="number"
            value="1"
            min="1"
            style="width:60px;">

    </div>

    `;

});

// ==========================================
// CAMBIAR DETALLE DEL ADICIONAL
// ==========================================

document.addEventListener("change", function(e){

    if(!e.target.classList.contains("tipoAdicional")) return;

    const tipo = e.target.value;

    const detalle = e.target.parentElement.querySelector(".detalleAdicional");

    let lista = [];

    switch(tipo){

        case "Fruta":
            lista = datos.frutas;
            break;

        case "Salsa":
            lista = datos.salsas;
            break;

        case "Clásico":
            lista = datos.clasicos;
            break;

        case "Premium":
            lista = datos.premium;
            break;

        case "Helado":
            lista = datos.helados;
            break;

        case "Nutella":
            lista = ["Nutella"];
            break;

        case "Queso":
            lista = ["Queso"];
            break;

        case "Suspiros":
            lista = ["Suspiros"];
            break;

    }

    detalle.innerHTML = `
        <option value="">Detalle</option>
        ${lista.map(x => `<option>${x}</option>`).join("")}
    `;

});
// ==========================================
// AGREGAR PRODUCTO AL PEDIDO
// ==========================================

document.getElementById("btnAgregarProducto").addEventListener("click", function(){

    const cliente = document.getElementById("cliente").value;
    const vaso = document.getElementById("vaso").value;
    const productoNombre = comboProducto.value;

    if(productoNombre === ""){
        alert("Seleccione un producto.");
        return;
    }

    const productoInfo = datos.productos.find(p => p.nombre === productoNombre);

    const frutas = [...document.querySelectorAll(".fruta")]
        .map(x => x.value)
        .filter(x => x !== "");

    const salsas = [...document.querySelectorAll(".salsa")]
        .map(x => x.value)
        .filter(x => x !== "");

    const clasicos = [...document.querySelectorAll(".clasico")]
        .map(x => x.value)
        .filter(x => x !== "");

    const premium = [...document.querySelectorAll(".premium")]
        .map(x => x.value)
        .filter(x => x !== "");

    const queso = document.getElementById("queso")?.checked || false;

    const observaciones = document.getElementById("observaciones")?.value || "";

    const adicionales = [];

    document.querySelectorAll("#listaAdicionales > div").forEach(fila => {

        const tipo = fila.querySelector(".tipoAdicional").value;
        const detalle = fila.querySelector(".detalleAdicional").value;
        const cantidad = Number(fila.querySelector("input").value) || 1;

        if(tipo !== "" && detalle !== ""){

            adicionales.push({
                tipo,
                detalle,
                cantidad,
                precio: datos.preciosAdicionales[tipo] || 0
            });

        }

    });

    const totalAdicionales = adicionales.reduce((suma, item) => {
        return suma + (item.precio * item.cantidad);
    }, 0);

    const totalProducto = productoInfo.precio + totalAdicionales;

    const productoFinal = {
    cliente,
    vaso,
    producto: productoNombre,
    frutas,
    salsas,
    clasicos,
    premium,
    queso,
    adicionales,
    observaciones,
    precioBase: productoInfo.precio,
    total: totalProducto
};

if(indiceEditando !== null){
    pedido[indiceEditando] = productoFinal;
    indiceEditando = null;
} else {
    pedido.push(productoFinal);
}

    actualizarPedido();

    limpiarFormularioProducto();

});
// ==========================================
// ACTUALIZAR PEDIDO EN PANTALLA
// ==========================================

function actualizarPedido(){

    let html = "";
    let total = 0;

    pedido.forEach((p, i) => {

        total += p.total;

        html += `
            <div style="border:1px solid #999;padding:10px;margin-bottom:15px;border-radius:8px;">

                <b>${i + 1}. ${p.producto}</b>

<button onclick="editarProducto(${i})">Editar</button>
<button onclick="eliminarProducto(${i})">Eliminar</button>
<br>

                👤 <b>Cliente:</b> ${p.cliente}<br>

                🥤 <b>Vaso:</b> ${p.vaso}<br><br>
        `;

        if(p.frutas.length){
            html += `<b>🍓 Frutas:</b> ${p.frutas.join(", ")}<br>`;
        }

        if(p.salsas.length){
            html += `<b>🥫 Salsas:</b> ${p.salsas.join(", ")}<br>`;
        }

        if(p.clasicos.length){
            html += `<b>🍪 Clásicos:</b> ${p.clasicos.join(", ")}<br>`;
        }

        if(p.premium.length){
            html += `<b>⭐ Premium:</b> ${p.premium.join(", ")}<br>`;
        }

        if(p.queso){
            html += `<b>🧀 Queso:</b> Sí<br>`;
        }

        if(p.adicionales.length){

            html += `<b>➕ Adicionales:</b><br>`;

            p.adicionales.forEach(a => {
                html += `- ${a.tipo}: ${a.detalle} x${a.cantidad}<br>`;
            });

        }

        if(p.observaciones !== ""){
            html += `<b>📝 Observaciones:</b> ${p.observaciones}<br>`;
        }

        html += `
                <br>
                <b>💰 $${p.total.toLocaleString("es-CO")}</b>

            </div>
        `;

    });

    document.getElementById("pedido").innerHTML = html;

    document.getElementById("totalPedido").textContent =
        "$" + total.toLocaleString("es-CO");

        localStorage.setItem("pedido", JSON.stringify(pedido));

}
// ==========================================
// LIMPIAR FORMULARIO DEL PRODUCTO
// ==========================================

function limpiarFormularioProducto(){

    document.getElementById("vaso").value = "";

    comboProducto.value = "";

    precio.textContent = "$0";

    ingredientes.innerHTML = "";

}
// ==========================================
// ELIMINAR PRODUCTO DEL PEDIDO
// ==========================================

function eliminarProducto(indice){

    pedido.splice(indice, 1);

    actualizarPedido();

}
// ==========================================
// ENVIAR A COCINA / GENERAR COMANDA
// ==========================================

document.getElementById("btnEnviar").addEventListener("click", function(){

    if(pedido.length === 0){
        alert("No hay productos en el pedido.");
        return;
    }

    generarComanda();

});

function generarComanda(){

    let total = 0;

    let html = `
        <div style="border:2px solid #000;padding:15px;margin-top:20px;">
            <h2>🍓 LA Q'FRESA</h2>

<h3>COMANDA</h3>

<h3>Pedido #${String(numeroPedido).padStart(4,"0")}</h3>
            <p><b>Cliente:</b> ${document.getElementById("cliente").value}</p>
            <hr>
    `;

    pedido.forEach((p, i) => {

        total += p.total;

        html += `
            <p><b>${i + 1}. ${p.producto}</b> - ${p.vaso}</p>
        `;

        p.frutas.forEach(x => html += `<p>- ${x}</p>`);
        p.salsas.forEach(x => html += `<p>- ${x}</p>`);
        p.clasicos.forEach(x => html += `<p>- ${x}</p>`);
        p.premium.forEach(x => html += `<p>- ${x}</p>`);

        if(p.queso){
            html += `<p>- Queso</p>`;
        }

        p.adicionales.forEach(a => {
            html += `<p>+ ${a.detalle} x${a.cantidad}</p>`;
        });

        if(p.observaciones !== ""){
            html += `<p><b>Indicaciones:</b> ${p.observaciones}</p>`;
        }

        html += `<hr>`;
    });

    html += `
        <h3>Total: $${total.toLocaleString("es-CO")}</h3>

        <button onclick="window.print()">
            Imprimir comanda
        </button>

        </div>
    `;

    document.getElementById("comanda").innerHTML = html;

    numeroPedido++;
localStorage.setItem("numeroPedido", numeroPedido);

}

// ==========================================
// FINALIZAR PEDIDO
// ==========================================

document.getElementById("btnFinalizar").addEventListener("click", function(){

    if(!confirm("¿Finalizar este pedido y limpiar todo?")){
        return;
    }

    pedido = [];

    document.getElementById("cliente").value = "";
    document.getElementById("vaso").value = "";

    comboProducto.value = "";
    precio.textContent = "$0";
    ingredientes.innerHTML = "";

    document.getElementById("pedido").innerHTML = "";
    document.getElementById("totalPedido").textContent = "$0";

    document.getElementById("comanda").innerHTML = "";

});
// ==========================================
// CARGAR PEDIDO GUARDADO
// ==========================================

window.addEventListener("load", function(){

    const pedidoGuardado = localStorage.getItem("pedido");

    if(pedidoGuardado){
        pedido = JSON.parse(pedidoGuardado);
        actualizarPedido();
    }

});
// ==========================================
// EDITAR PRODUCTO
// ==========================================

function editarProducto(indice){

    const p = pedido[indice];

    indiceEditando = indice;

    document.getElementById("cliente").value = p.cliente;
    document.getElementById("vaso").value = p.vaso;

    comboProducto.value = p.producto;
    comboProducto.dispatchEvent(new Event("change"));

    setTimeout(() => {

        document.querySelectorAll(".fruta").forEach((x,i)=>{
            x.value = p.frutas[i] || "";
        });

        document.querySelectorAll(".salsa").forEach((x,i)=>{
            x.value = p.salsas[i] || "";
        });

        document.querySelectorAll(".clasico").forEach((x,i)=>{
            x.value = p.clasicos[i] || "";
        });

        document.querySelectorAll(".premium").forEach((x,i)=>{
            x.value = p.premium[i] || "";
        });

        if(document.getElementById("queso")){
            document.getElementById("queso").checked = p.queso;
        }

        if(document.getElementById("observaciones")){
            document.getElementById("observaciones").value = p.observaciones;
        }

        const listaAdicionales = document.getElementById("listaAdicionales");
        listaAdicionales.innerHTML = "";

        p.adicionales.forEach(a => {

            document.getElementById("btnAgregarAdicional").click();

            const filas = document.querySelectorAll("#listaAdicionales > div");
            const fila = filas[filas.length - 1];

            fila.querySelector(".tipoAdicional").value = a.tipo;
            fila.querySelector(".tipoAdicional").dispatchEvent(new Event("change"));

            fila.querySelector(".detalleAdicional").value = a.detalle;
            fila.querySelector("input").value = a.cantidad;

        });

    }, 100);

}
// ==========================================
// REGISTRAR SERVICE WORKER
// ==========================================

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./service-worker.js")
        .then(() => console.log("Service Worker registrado"))
        .catch(error => console.log("Error registrando Service Worker:", error));
}