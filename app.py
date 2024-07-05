from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
CORS(app)

# Configuración de la base de datos
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://username:password@localhost/mascotas_db'
app.config['SQLALCHEMY_BINDS'] = {
    'granja': 'postgresql://username:password@localhost/granja_db'
}
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Modelo para mascotas
class Pet(db.Model):
    __tablename__ = 'pets'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    type = db.Column(db.String(50), nullable=False)

# Modelo para tomates
class Tomate(db.Model):
    __bind_key__ = 'granja'
    __tablename__ = 'tomates'
    id = db.Column(db.Integer, primary_key=True)
    cantidad = db.Column(db.Integer, default=0)

# Crear las tablas
with app.app_context():
    db.create_all()

# Rutas para las mascotas
@app.route('/api/pets', methods=['GET'])
def get_pets():
    try:
        pets = Pet.query.all()
        return jsonify({'data': [{'id': pet.id, 'name': pet.name, 'gender': pet.gender, 'type': pet.type} for pet in pets]})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/pets', methods=['POST'])
def add_pet():
    try:
        pet_data = request.json
        name = pet_data.get('name')
        gender = pet_data.get('gender')
        type = pet_data.get('type')

        new_pet = Pet(name=name, gender=gender, type=type)
        db.session.add(new_pet)
        db.session.commit()

        return jsonify({
            'message': 'Mascota agregada correctamente',
            'data': {'id': new_pet.id, 'name': name, 'gender': gender, 'type': type}
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Rutas para los tomates
@app.route('/api/tomates', methods=['GET'])
def obtener_tomates():
    try:
        print("Entering obtener_tomates function")
        tomate = Tomate.query.first()
        print("Tomate:", tomate)
        if tomate:
            total = tomate.cantidad
        else:
            total = 0
        print("Total tomates:", total)
        return jsonify({'total_tomates': total}), 200
    except Exception as e:
        print("Error:", e)
        return jsonify({'error': str(e)}), 400

@app.route('/api/tomates', methods=['POST'])
def actualizar_tomates():
    try:
        data = request.json
        cantidad = data.get('cantidad')

        tomate = Tomate.query.first()
        if tomate:
            tomate.cantidad += cantidad
        else:
            tomate = Tomate(cantidad=cantidad)
            db.session.add(tomate)
        db.session.commit()

        return jsonify({'message': 'Tomates actualizados correctamente'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
