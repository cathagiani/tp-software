Dragon City API
Este proyecto es una API desarrollada en Flask para gestionar mascotas (dragones) y tomates en un entorno similar a Dragon City.

Características
Gestión de Mascotas (Dragones): Permite añadir, editar, eliminar y listar dragones.
Gestión de Tomates: Controla la cantidad total de tomates disponibles y la alimentación de dragones con estos.

Tecnologías Utilizadas
Flask
Flask-CORS
Flask-SQLAlchemy
PostgreSQL
Bootstrap (para la interfaz de usuario en el frontend)

Instalación
Clona el repositorio:
git clone https://github.com/cathagiani/tp-software.git
cd tp-software

Configura la base de datos PostgreSQL:

Crea una base de datos mascotas_db en tu servidor local PostgreSQL.
Actualiza las configuraciones de conexión en app.py para reflejar tu configuración local.
Ejecuta la aplicación:
python3 app.py
La aplicación estará disponible en http://localhost:5000.

Uso
API Endpoints
GET /api/pets: Obtiene la lista de todos los dragones.
POST /api/pets: Añade un nuevo dragón.
PUT /api/pets/<id>: Edita un dragón existente por su ID.
DELETE /api/pets/<id>: Elimina un dragón por su ID.
GET /api/tomates: Obtiene la cantidad total de tomates disponibles.
POST /api/tomates: Actualiza la cantidad de tomates disponibles.
POST /api/alimentar: Permite alimentar a un dragón utilizando tomates.

Interfaz de Usuario
La interfaz de usuario está diseñada con Bootstrap y permite adoptar dragones, ver detalles, editar y eliminar.
