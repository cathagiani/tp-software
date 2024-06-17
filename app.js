let mascotaSeleccionada = '';
let mascotas = [];

document.addEventListener('DOMContentLoaded', cargarMascotas);

// funcion para adoptar una mascota
function adoptarMascota(mascota) {
    mascotaSeleccionada = mascota;
    document.getElementById('mensaje-adopcion').textContent = `Estás adoptando un ${mascota}. ¿Estás seguro de tu elección?`;
    document.getElementById('alerta-adopcion').classList.remove('oculto');
}

// funcion para confirmar la adopcion
function confirmarAdopcion(confirmar) {
    document.getElementById('alerta-adopcion').classList.add('oculto');
    if (confirmar) {
        document.getElementById('formulario-adopcion').classList.remove('oculto');
    }
}

// funcion para completar detalles de mascota nueva
function finalizarAdopcion() {
    const nombre = document.getElementById('nombre-mascota').value;
    const genero = document.getElementById('genero-mascota').value;

    if (!nombre || !genero) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    const mascota = {
        type: mascotaSeleccionada,
        name: nombre,
        gender: genero
    };

    guardarMascota(mascota);
    mostrarMascotaAdoptada(mascota);

    document.getElementById('formulario-adopcion').classList.add('oculto');
    document.getElementById('form-de-adopcion').reset();
}

// funcion para mostrar los detalles de la mascota apenas se adopta
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


// funcion para agregar mascota a la lista de mascotas
function agregarMascotaALaLista(mascota) {
    const lista = document.getElementById('lista-mascotas');
    const item = document.createElement('li');
    item.textContent = `${mascota.name}`;
    item.classList.add('lista-mascotas-item');
    item.onclick = () => mostrarDetallesMascota(mascota);
    lista.appendChild(item);
}

// funcion para mostrar detalles de mascota al apretar el boton de su nombre
function mostrarDetallesMascota(mascota) {
    document.getElementById('detalles-ver-mascota').innerHTML = `
        Tipo: ${mascota.type}<br>
        Nombre: ${mascota.name}<br>
        Género: ${mascota.gender}<br>
    `;

    const imagenMascota = obtenerImagenMascota(mascota.type);
    document.getElementById('imagen-ver-mascota').src = imagenMascota;
    document.getElementById('ver-mascota').classList.remove('oculto');
}

// funcion ára asignarle una imagen a cada tipo de mascota
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

// funcion para guardar mascota en la base de datos
function guardarMascota(mascota) {
    fetch('http://localhost:3000/api/pets', {
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

// funcion para cargar las mascotas guardadas
function cargarMascotas() {
    fetch('http://localhost:3000/api/pets')
    .then(response => response.json())
    .then(data => {
        mascotas = data.data;
        const lista = document.getElementById('lista-mascotas');
        lista.innerHTML = '';  // Limpiar la lista antes de volver a cargar las mascotas

        mascotas.forEach(mascota => {
            agregarMascotaALaLista(mascota);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
