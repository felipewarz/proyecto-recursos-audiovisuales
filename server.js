const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// 🔌 CONEXIÓN A MYSQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Admin123!', // ← usa tu contraseña real
  database: 'gestion_recursos_audiovisuales'
});

db.connect((err) => {
  if (err) {
    console.error('❌ Error al conectar a MySQL:', err);
    return;
  }
  console.log('✅ Conectado correctamente a MySQL');
});

// 🏠 RUTA PRINCIPAL
app.get('/', (req, res) => {
  res.send('Backend funcionando correctamente');
});

// 📦 OBTENER RECURSOS
app.get('/recursos', (req, res) => {
  const sql = 'SELECT * FROM recursos_audiovisuales';

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al obtener recursos' });
    }

    res.json(results);
  });
});

// 🔐 LOGIN
app.post('/login', (req, res) => {
  const { correo, contrasena } = req.body;

  const sql = `
    SELECT id_usuario, nombre, correo, id_rol
    FROM usuarios
    WHERE correo = ? AND contrasena = ?
  `;

  db.query(sql, [correo, contrasena], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    res.json({
      mensaje: 'Inicio de sesión correcto',
      usuario: results[0]
    });
  });
});

// 📝 CREAR SOLICITUD
app.post('/solicitud', (req, res) => {
  const { id_usuario, fecha_inicio, fecha_fin } = req.body;

  const sql = `
    INSERT INTO solicitudes_prestamo 
    (fecha_inicio, fecha_fin, id_usuario, id_estado_solicitud)
    VALUES (?, ?, ?, 1)
  `;

  db.query(sql, [fecha_inicio, fecha_fin, id_usuario], (err, result) => {
    if (err) {
      console.error('❌ Error al crear solicitud:', err);
      return res.status(500).json({ mensaje: 'Error al crear solicitud' });
    }

    res.json({ mensaje: 'Solicitud creada correctamente' });
  });
});

// 🚀 LEVANTAR SERVIDOR (ESTO ES CLAVE)
app.listen(3000, () => {
  console.log('🚀 Servidor iniciado en http://localhost:3000');
});