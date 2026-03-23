const gastos = JSON.parse(localStorage.getItem("gastos")) || [];

// Elementos del DOM
const form = document.getElementById("formGasto");
const lista = document.getElementById("listaGastos");
const totalSpan = document.getElementById("total");
const selectOrden = document.getElementById("ordenar");
const inputFiltro = document.getElementById("filtro");
const selectCategoria = document.getElementById("categoria");

fetch("data/categorias.json")
    .then(res => res.json())
    .then(data => {
        data.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat;
            option.textContent = cat;
            selectCategoria.appendChild(option);
        });

        renderizar ();
    });

// Función para agregar gasto 
function agregarGasto(nombre, monto, categoria) {
    gastos.push({
        nombre: nombre,
        monto: monto,
        categoria: categoria
    });

    localStorage.setItem("gastos", JSON.stringify(gastos));
}

// Función de procesamiento 
function calcularTotal() {
    let total = 0;

    for (let i = 0; i < gastos.length; i++) {
        total += gastos[i].monto;
    }

    return total;
}

// Función de salida
function renderizar(listaGastos = gastos) {
    lista.innerHTML = "";

    listaGastos.forEach((gasto, index) => {
    const li = document.createElement ("li");
  
    li.innerHTML = `
        ${gasto.nombre} - $${gasto.monto} - ${gasto.categoria}
        <button>ELIMINAR</button>
      `;

    li.querySelector("button").addEventListener("click", () => {
        gastos.splice(index, 1);
        localStorage.setItem("gastos", JSON.stringify(gastos));
        renderizar();
    });

    lista.appendChild(li);
});

    totalSpan.textContent = calcularTotal();
    renderizarGrafico();
}

// Grafico
let grafico;

function renderizarGrafico(){
    const categorias = {};

    gastos.forEach(gasto => {
        if (categorias [gasto.categoria]) {
            categorias [gasto.categoria] += gasto.monto;
        } else {
            categorias [gasto.categoria] = gasto.monto;
        }
    });
    
    const labels = Object.keys(categorias);
    const data = Object.values(categorias);

    const ctx = document.getElementById("grafico").getContext("2d");

    if (grafico) {
        grafico.destroy();
    }

    grafico = new Chart(ctx, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    "#ff7aa2",
                    "#a29bfe",
                    "#74c0fc",
                    "#63e6be",
                    "#ffd43b"
                 ]    
            }]
        }
    });
}

// Evento 
form.addEventListener("submit", function(e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const monto = Number(document.getElementById("monto").value);
    const categoria = document.getElementById("categoria").value;

    if (nombre !== "" && monto > 0 && categoria !=="") {
        agregarGasto(nombre, monto, categoria);
        renderizar();
        form.reset();
    }
});

selectOrden.addEventListener("change", () => {
    let copia = [...gastos];
    
    if (selectOrden.value === "mayor") {
        copia.sort((a,b) => b.monto - a.monto);        
    } else if (selectOrden.value === "menor") {
        copia.sort((a, b) => a.monto - b.monto);
    }

    renderizar(copia);
});

inputFiltro.addEventListener("input", () => {
    const texto = inputFiltro.value.toLowerCase();

    const filtrados = gastos.filter(gasto =>
        gasto.nombre.toLowerCase().includes (texto)
    );

    renderizar(filtrados);
});

// Render inicial 
renderizar();