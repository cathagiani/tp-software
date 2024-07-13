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
        case 'dragon legado':
            return 'https://static.wikia.nocookie.net/dragoncity/images/b/b4/Legendario_1.png/revision/latest?cb=20140130011033&path-prefix=es';
        case 'dragon espejo':
            return 'https://dci-static-s1.socialpointgames.com/static/dragoncity/mobile/ui/dragons/ui_1054_dragon_mirror_c_1@2x.png';
        case 'dragon cristal':
            return 'https://dci-static-s1.socialpointgames.com/static/dragoncity/mobile/ui/dragons/ui_1052_dragon_crystal_b_1@2x.png';
        case 'dragon diluvio':
            return 'https://dci-static-s1.socialpointgames.com/static/dragoncity/mobile/ui/dragons/ui_2536_dragon_deluge_b_1@2x.png';
        case 'dragon kratus':
            return 'https://www.ditlep.com/image?m=dragons/ui_1191_dragon_kratus_b_1.png';
        case 'dragon abismo':
            return 'https://dci-static-s1.socialpointgames.com/static/dragoncity/mobile/ui/dragons/ui_1315_dragon_abyss_1@2x.png';
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