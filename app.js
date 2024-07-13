let mascotaSeleccionada = '';
let mascotas = [];
let cantidadTomates = 0;

document.addEventListener('DOMContentLoaded', () => {
    cargarMascotas();
    cargarTomates();
});

// función para adoptar una mascota
function adoptarMascota(mascota) {
    mascotaSeleccionada = mascota;
    document.getElementById('mensaje-adopcion').textContent = `Estás adoptando un ${mascota}. ¿Estás seguro de tu elección?`;
    document.getElementById('alerta-adopcion').classList.remove('oculto');
}

// función para confirmar la adopción
function confirmarAdopcion(confirmar) {
    document.getElementById('alerta-adopcion').classList.add('oculto');
    if (confirmar) {
        document.getElementById('formulario-adopcion').classList.remove('oculto');
    }
}

// función para completar detalles de mascota nueva
function finalizarAdopcion() {
    const nombre = document.getElementById('nombre-mascota').value;
    const genero = document.getElementById('genero-mascota').value;

    if (!nombre || !genero) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    const mascota = {
        name: nombre,
        gender: genero,
        type: mascotaSeleccionada
    };

    guardarMascota(mascota);
    mostrarMascotaAdoptada(mascota);

    document.getElementById('formulario-adopcion').classList.add('oculto');
    document.getElementById('form-de-adopcion').reset();
}

// función para mostrar los detalles de la mascota al adoptarla
function mostrarMascotaAdoptada(mascota) {
    document.getElementById('detalles-mascota').innerHTML = `
        Tipo: ${mascota.type}<br>
        Nombre: ${mascota.name}<br>
        Género: ${mascota.gender}<br>
    `;

    const imagenMascota = obtenerImagenMascota(mascota.type);
    document.getElementById('imagen-mascota-adoptada').src = imagenMascota;
    document.getElementById('mascota-adoptada').classList.remove('oculto');
}

// función para agregar mascota a la lista de mascotas
function agregarMascotaALaLista(mascota) {
    const lista = document.getElementById('lista-mascotas');
    const item = document.createElement('li');
    item.textContent = `${mascota.name}`;
    item.classList.add('lista-mascotas-item');
    item.onclick = () => mostrarDetallesMascota(mascota);
    lista.appendChild(item);
}

// función para mostrar detalles de mascota al hacer clic en su nombre
function mostrarDetallesMascota(mascota) {
    document.getElementById('detalles-ver-mascota').innerHTML = `
        Tipo: ${mascota.type}<br>
        Nombre: ${mascota.name}<br>
        Género: ${mascota.gender}<br>
    `;

    const imagenMascota = obtenerImagenMascota(mascota.type);
    document.getElementById('imagen-ver-mascota').src = imagenMascota;
    document.getElementById('ver-mascota').classList.remove('oculto');

    // Asigna el ID de la mascota al botón de eliminar
    const botonEliminar = document.getElementById('boton-eliminar');
   botonEliminar.setAttribute('data-id', mascota.id);


   // Asignar el ID de la mascota al formulario de edición
   const formularioEdicion = document.getElementById('formulario-edicion');
   formularioEdicion.setAttribute('data-id', mascota.id);
  
}

// función para asignar una imagen a cada tipo de mascota
function obtenerImagenMascota(tipo) {
    switch (tipo) {
        case 'dragon de fuego':
            return 'https://static.wikia.nocookie.net/dragoncity/images/c/cd/Flame_Dragon_1.png/revision/latest?cb=20200602233653';
        case 'dragon de agua':
            return 'https://static.wikia.nocookie.net/dragoncity/images/c/cd/Sea_Dragon_1.png/revision/latest?cb=20130611042156';
        case 'dragon nube':
            return 'https://static.wikia.nocookie.net/dragoncity/images/f/f8/Cloud_Dragon_1.png/revision/latest?cb=20121017102829';
        case 'dragon diente de leon':
            return 'https://static.wikia.nocookie.net/dragoncity/images/f/ff/Dandelion_Dragon_1.png/revision/latest?cb=20130710092134';
        case 'dragon fluorescente':
            return 'https://static.wikia.nocookie.net/dragoncity/images/6/68/Fluorescent_Dragon_1.png/revision/latest?cb=20130709084051';
        case 'dragon de tierra':
            return 'https://static.wikia.nocookie.net/dragoncity/images/c/ca/Terra_Dragon_1.png/revision/latest?cb=20200605234519';
        default:
            return '';
    }
}

// función para guardar mascota en la base de datos
function guardarMascota(mascota) {
    fetch('http://localhost:5000/api/pets', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(mascota)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        mascotas.push(data.data);  // Agregar mascota a la lista localmente
        cargarMascotas();  // Actualizar la lista en la interfaz
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// función para cargar las mascotas guardadas
function cargarMascotas() {
    fetch('http://localhost:5000/api/pets')
    .then(response => response.json())
    .then(data => {
        mascotas = data.data;
        const lista = document.getElementById('lista-mascotas');
        lista.innerHTML = '';  // Limpiar la lista antes de volver a cargar a las mascotas

        mascotas.forEach(mascota => {
            agregarMascotaALaLista(mascota);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


// funcion para eliminar un dragon
function eliminarDragon(button) {
    const id = button.getAttribute('data-id');
   
    fetch(`http://localhost:5000/api/pets/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        // Remover el dragón de la lista localmente
        mascotas = mascotas.filter(mascota => mascota.id !== id);
        cargarMascotas(); // Actualizar la lista en la interfaz
    })
    .catch(error => {
        console.error('Error:', error);
    });
 }
 
 
 
 
 // función para mostrar el formulario para cambiar los datos del dragón
 function mostrarFormularioEdicion() {
    const id = document.getElementById('formulario-edicion').getAttribute('data-id');
    const mascota = mascotas.find(m => m.id == id);
 
 
    if (!mascota) {
        console.error('No se encontró ninguna mascota con el ID ${id}');
        return;
    }
 
 
    document.getElementById('editar-nombre').value = mascota.name;
    document.getElementById('editar-genero').value = mascota.gender;
 
 
    // Mostrar el formulario de edición
    document.getElementById('formulario-edicion').classList.remove('oculto');
 }
 
 
 
 
 // función para editar un dragón
 function editarDragon(id, nuevosDatos) {
    fetch(`http://localhost:5000/api/pets/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevosDatos)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // Actualizar el dragón en la lista localmente
        const indice = mascotas.findIndex(mascota => mascota.id == id);
        if (indice !== -1) {
            mascotas[indice] = data.data;
            cargarMascotas(); // Actualizar la lista en la interfaz
        }
        document.getElementById('formulario-edicion').classList.add('oculto'); // Ocultar el formulario de edición después de confirmar los cambios
    })
    .catch(error => {
        console.error('Error:', error);
    });
 }
 
 
 // función para confirmar los cambios en la edición de una mascota
 function confirmarEdicion() {
    const id = document.getElementById('formulario-edicion').getAttribute('data-id');
    const nuevosDatos = {
        name: document.getElementById('editar-nombre').value,
        gender: document.getElementById('editar-genero').value,
        type: document.getElementById('editar-tipo').value
    };
 
 
    editarDragon(id, nuevosDatos); // Llamar a la función para editar la mascota
 
 
    // Ocultar el formulario de edición después de confirmar los cambios
    document.getElementById('formulario-edicion').classList.add('oculto');
 }

// función para cargar los tomates recolectados
function cargarTomates() {
    fetch('http://localhost:5000/api/tomates')
   .then(response => response.json())
   .then(data => {
        cantidadTomates = data.total_tomates || 0;
        document.getElementById("cantidad-tomates").textContent = `Tomates: ${cantidadTomates}`;
    })
   .catch(error => {
        console.error('Error:', error);
    });
}

// función para recolectar tomates
function recolectarTomates() {
    const cantidad = 500;
    fetch('http://localhost:5000/api/tomates', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cantidad: cantidad })
    })
   .then(response => response.json())
   .then(data => {
        console.log(data);
        cantidadTomates += cantidad;
        document.getElementById("cantidad-tomates").textContent = `Tomates: ${cantidadTomates}`;
    })
   .catch(error => {
        console.error('Error:', error);
    });
}


// función para guardar la cantidad de tomates recolectados
function guardarTomates(cantidad) {
    fetch('http://localhost:5000/api/tomates', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cantidad: cantidad })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}