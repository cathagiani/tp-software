const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('mascotas.db');

app.use(cors());
app.use(bodyParser.json());

// Verificar si la tabla pets ya existe antes de crearla
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='pets'", (err, row) => {
    if (err) {
        console.error(err.message);
        return;
    }
    if (!row) {
        // La tabla no existe, entonces la creamos
        db.run("CREATE TABLE pets (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, gender TEXT, type TEXT)");
    }
    });

// Obtener todas las mascotas
app.get('/api/pets', (req, res) => {
    db.all("SELECT * FROM pets", [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            data: rows
        });
    });
});

// Guardar nueva mascota
app.post('/api/pets', (req, res) => {
    const { name, gender, type } = req.body;
    const stmt = db.prepare("INSERT INTO pets (name, gender, type) VALUES (?, ?, ?)");
    stmt.run(name, gender, type, function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: "Mascota agregada correctamente",
            data: { id: this.lastID, name, gender, type }
        });
    });
    stmt.finalize();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
