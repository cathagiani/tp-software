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
        case 'perro':
            return 'https://i.pinimg.com/564x/34/6a/9e/346a9e4749e3e125efd67b41a487b306.jpg';
        case 'gato':
            return 'https://i.pinimg.com/564x/70/f8/1a/70f81ae6f408141cd36274d127b7d4f4.jpg';
        case 'conejo':
            return 'https://i.pinimg.com/736x/7f/43/e3/7f43e3e050b0e7b5d184961f539a434c.jpg';
        case 'carpincho':
            return 'https://i.pinimg.com/564x/e6/37/e0/e637e0d62f5644460649e7d2e5707ad5.jpg';
        case 'hamster':
            return 'https://i.pinimg.com/564x/75/7b/d0/757bd02f994c15b51b41d234444ebc42.jpg';
        case 'oso':
            return 'https://i.pinimg.com/564x/5c/db/81/5cdb815dbacce91181d7413ec5b0640c.jpg';
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
