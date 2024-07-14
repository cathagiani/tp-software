from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
CORS(app)

# Configuración de la base de datos
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://username:password@localhost/mascotas_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Modelo para mascotas
class Pet(db.Model):
    __tablename__ = 'pets'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    tomatoes = db.relationship('TomateDragon', backref='pet', lazy=True)

# Modelo para tomates
class Tomate(db.Model):
    __tablename__ = 'tomates'
    id = db.Column(db.Integer, primary_key=True)
    cantidad = db.Column(db.Integer, default=0)

class TomateDragon(db.Model):
    __tablename__ = 'tomates_dragon'
    id = db.Column(db.Integer, primary_key=True)
    cantidad = db.Column(db.Integer, default=0)
    pet_id = db.Column(db.Integer, db.ForeignKey('pets.id'), nullable=False)


# Crear las tablas
with app.app_context():
    db.create_all()

# Rutas para las mascotas
@app.route('/api/pets', methods=['GET'])
def get_pets():
    try:
        pets = Pet.query.all()
        return jsonify({'data': [{'id': pet.id, 'name': pet.name, 'gender': pet.gender, 'type': pet.type, 'tomatoes': [{'id': t.id, 'cantidad': t.cantidad} for t in pet.tomatoes]} for pet in pets]})
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

        # Crear tabla de tomates para el nuevo dragón
        new_tomate_dragon = TomateDragon(cantidad=0, pet_id=new_pet.id)
        db.session.add(new_tomate_dragon)
        db.session.commit()

        return jsonify({
            'message': 'Mascota agregada correctamente',
            'data': {'id': new_pet.id, 'name': name, 'gender': gender, 'type': type}
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400


# Ruta eliminar una mascota por ID
@app.route('/api/pets/<int:id>', methods=['DELETE'])
def eliminar_mascota(id):
   try:
       mascota = Pet.query.get(id)
       if mascota:
           db.session.delete(mascota)
           db.session.commit()
           return jsonify({'message': 'Mascota eliminada correctamente'}), 200
       else:
           return jsonify({'error': 'No se encontró ninguna mascota con ese ID'}), 404
   except Exception as e:
       return jsonify({'error': str(e)}), 400


# Ruta para editar una mascota por su ID
@app.route('/api/pets/<int:id>', methods=['PUT'])
def editar_mascota(id):
   try:
       data = request.json
       nombre = data.get('name')
       genero = data.get('gender')
       tipo = data.get('type')


       mascota = Pet.query.get(id)
       if mascota:
           mascota.name = nombre
           mascota.type = tipo
           mascota.gender = genero
           db.session.commit()
           return jsonify({
               'message': 'Mascota editada correctamente',
               'data': {'id': mascota.id, 'name': nombre, 'gender': genero, 'type': tipo}
           }), 200
       else:
           return jsonify({'error': 'No se encontró ninguna mascota con ese ID'}), 404
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


@app.route('/api/alimentar', methods=['POST'])
def alimentar_dragon():
    try:
        data = request.json
        pet_id = data.get('pet_id')
        cantidad = 500

        tomate = Tomate.query.first()
        if not tomate or tomate.cantidad < cantidad:
            return jsonify({'error': 'No tienes suficientes tomates'}), 400

        tomate_dragon = TomateDragon.query.filter_by(pet_id=pet_id).first()
        if not tomate_dragon:
            return jsonify({'error': 'Dragón no encontrado'}), 404

        tomate.cantidad -= cantidad
        tomate_dragon.cantidad += cantidad

        db.session.commit()

        return jsonify({'message': 'Dragón alimentado correctamente', 'tomates': tomate.cantidad, 'tomates_dragon': tomate_dragon.cantidad}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


if __name__ == '__main__':
    app.run(debug=True)
