from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app)

# Configuración de la base de datos de mascotas
DB_MASCOTAS = 'mascotas.db'
app.config['SECRET_KEY'] = 'your_secret_key'

# Configuración de la base de datos de la granja
DB_GRANJA = 'granja.db'

#### todo lo de las mascotas aca abajo por ahora !!!
# Crear la tabla 'pets' si no existe
def create_mascotas_table():
    with sqlite3.connect(DB_MASCOTAS) as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS pets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                gender TEXT,
                type TEXT
            )
        """)
        conn.commit()

create_mascotas_table()

# Obtener todas las mascotas
@app.route('/api/pets', methods=['GET'])
def get_pets():
    try:
        with sqlite3.connect(DB_MASCOTAS) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM pets")
            rows = cursor.fetchall()
            pets = [{'id': row[0], 'name': row[1], 'gender': row[2], 'type': row[3]} for row in rows]
            return jsonify({'data': pets})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Guardar nueva mascota
@app.route('/api/pets', methods=['POST'])
def add_pet():
    try:
        pet_data = request.json
        name = pet_data.get('name')
        gender = pet_data.get('gender')
        type = pet_data.get('type')

        with sqlite3.connect(DB_MASCOTAS) as conn:
            cursor = conn.cursor()
            cursor.execute("INSERT INTO pets (name, gender, type) VALUES (?, ?, ?)", (name, gender, type))
            pet_id = cursor.lastrowid
            conn.commit()
        
        return jsonify({
            'message': 'Mascota agregada correctamente',
            'data': {'id': pet_id, 'name': name, 'gender': gender, 'type': type}
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400


### todo lo de la granja aca abajo por ahora !!!

# Crear la tabla 'tomates' si no existe
def create_granja_table():
    with sqlite3.connect(DB_GRANJA) as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS tomates (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                cantidad INTEGER
            )
        """)
        conn.commit()

        # Verificar si ya existe un registro en la tabla tomates
        cursor.execute("SELECT COUNT(*) FROM tomates")
        count = cursor.fetchone()[0]
        if count == 0:
            # Si no existe, crear un registro con cantidad 0
            cursor.execute("INSERT INTO tomates (cantidad) VALUES (0)")
            conn.commit()

create_granja_table()


# Obtener cantidad total de tomates recolectados
@app.route('/api/tomates', methods=['GET'])
def obtener_tomates():
    try:
        with sqlite3.connect(DB_GRANJA) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT cantidad FROM tomates")
            row = cursor.fetchone()
            if row:
                total = row[0]
            else:
                total = 0

        return jsonify({'total_tomates': total}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


# Actualizar cantidad de tomates recolectados
@app.route('/api/tomates', methods=['POST'])
def actualizar_tomates():
    try:
        data = request.json
        cantidad = data.get('cantidad')

        with sqlite3.connect(DB_GRANJA) as conn:
            cursor = conn.cursor()
            cursor.execute("UPDATE tomates SET cantidad = cantidad +? WHERE id = 1", (cantidad,))
            conn.commit()

        return jsonify({'message': 'Tomates actualizados correctamente'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


if __name__ == '__main__':
    app.run(debug=True)
