const columnas = document.querySelectorAll('.columna');
const botonesAnadir = document.querySelectorAll('.btn-mas');


let tarjetaArrastrada = null;

// Inicializamos las tarjetas que ya vienen en el HTML (si hay alguna)
document.querySelectorAll('.tarjeta').forEach((tarjeta) => {
    activarTarjeta(tarjeta);
});


// --- GESTIÓN DE LAS COLUMNAS (DRAG & DROP) ---
columnas.forEach((columna) => {
    
    // Este evento detecta cuando pasamos una tarjeta por encima de la columna
    columna.addEventListener('dragover', (e) => {
        e.preventDefault(); // Sin esto no se permite soltar
        
        const elementoDebajo = e.target;
        const tarjetaDebajo = elementoDebajo.closest('.tarjeta');
        const listaTareas = columna.querySelector('.contenedor-tareas');

        
        // Si estamos encima de otra tarjeta, nos colocamos delante
        if (tarjetaDebajo && tarjetaDebajo !== tarjetaArrastrada) {
            listaTareas.insertBefore(tarjetaArrastrada, tarjetaDebajo);
        } else {
            // Si estamos en un hueco vacío, nos vamos al final de la lista
            listaTareas.appendChild(tarjetaArrastrada);
        }
    });

});



botonesAnadir.forEach((boton) => {
    
    boton.addEventListener('click', (e) => {
        // 1. Ocultamos el botón al pulsarlo
        const botonActual = e.target;
        botonActual.style.display = 'none';

        // 2. Creamos el formulario
        const zonaAnadir = botonActual.parentElement;
        const formDiv = document.createElement('div');
        formDiv.className = 'formulario-nuevo';

        // Usamos innerHTML para escribir la estructura del formulario más rápido
        formDiv.innerHTML = `
            <textarea placeholder="Escribe la tarea..."></textarea>
            <div class="grupo-botones">
                <button class="btn-guardar">Añadir</button>
                <button class="btn-cancelar">Cancelar</button>
            </div>
        `;

        zonaAnadir.appendChild(formDiv);
        
        // Ponemos el foco en el textarea para empezar a escribir
        const textarea = formDiv.querySelector('textarea');
        textarea.focus();

        
        const btnGuardar = formDiv.querySelector('.btn-guardar');
        btnGuardar.addEventListener('click', () => {
            const texto = textarea.value;
            if (texto.length > 0) {
                crearNuevaTarjeta(texto, botonActual); 
                formDiv.remove();
                botonActual.style.display = 'block';
            }
        });

        const btnCancelar = formDiv.querySelector('.btn-cancelar');
        btnCancelar.addEventListener('click', () => {
            formDiv.remove();
            botonActual.style.display = 'block';
        });
    });

});



function crearNuevaTarjeta(textoTarea, botonReferencia) {
    const columna = botonReferencia.closest('.columna');
    const lista = columna.querySelector('.contenedor-tareas');
    const nuevaTarjeta = document.createElement('div');
    nuevaTarjeta.className = 'tarjeta';
    nuevaTarjeta.setAttribute('draggable', 'true');
        nuevaTarjeta.innerHTML = `
        <p class="contenido-tarea">${textoTarea}</p>
        <button class="btn-borrar" title="Eliminar">X</button>
    `;

    
    activarTarjeta(nuevaTarjeta);
    lista.appendChild(nuevaTarjeta);
}

// Función que asigna los eventos necesarios a cada tarjeta individual
function activarTarjeta(tarjeta) {
    tarjeta.addEventListener('dragstart', () => {
        tarjetaArrastrada = tarjeta;
        setTimeout(() => {
            tarjeta.classList.add('arrastrando');
        }, 0);
    });

    // Evento al soltar
    tarjeta.addEventListener('dragend', () => {
        tarjeta.classList.remove('arrastrando');
        tarjetaArrastrada = null;
    });

    // Evento del botón de borrar (X)
    const btnX = tarjeta.querySelector('.btn-borrar');
    btnX.addEventListener('click', () => {
        tarjeta.remove();
    });
}