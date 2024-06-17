from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app)

# Configurar la base de datos SQLite
DB_NAME = 'mascotas.db'
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Crear la tabla 'pets' si no existe
def create_table():
    with sqlite3.connect(DB_NAME) as conn:
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

create_table()

# Obtener todas las mascotas
@app.route('/api/pets', methods=['GET'])
def get_pets():
    try:
        with sqlite3.connect(DB_NAME) as conn:
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

        with sqlite3.connect(DB_NAME) as conn:
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

if __name__ == '__main__':
    app.run(debug=True)
