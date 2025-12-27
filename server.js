const express = require('express');
const path = require('path');
const fs = require('fs'); // Necesario para guardar archivos
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para entender JSON que viene de la App
app.use(express.json());

// Servir archivos estáticos (tu App visual)
app.use(express.static(path.join(__dirname, 'dist')));

// --- "BASE DE DATOS" SIMULADA (Archivos JSON) ---
const DATA_DIR = path.join(__dirname, 'data');
// Crear la carpeta 'data' si no existe
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

// API: Guardar datos de usuario
app.post('/api/save/:user', (req, res) => {
    try {
        const { user } = req.params;
        // Sanitizar el nombre de usuario para evitar problemas con nombres de archivo
        const safeUser = user.replace(/[^a-z0-9]/gi, '_').toLowerCase();

        // Guardamos todo el estado del usuario en un archivo json
        fs.writeFileSync(path.join(DATA_DIR, `${safeUser}.json`), JSON.stringify(req.body));

        console.log(`Datos guardados para: ${safeUser}`);
        res.json({ success: true, message: '¡Datos guardados en la nube! ☁️' });
    } catch (error) {
        console.error('Error guardando:', error);
        res.status(500).json({ success: false, message: 'Error interno al guardar' });
    }
});

// API: Cargar datos de usuario
app.get('/api/load/:user', (req, res) => {
    try {
        const { user } = req.params;
        const safeUser = user.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const filePath = path.join(DATA_DIR, `${safeUser}.json`);

        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            res.json(JSON.parse(data));
        } else {
            // Si es usuario nuevo, devolvemos null para que la app inicie de cero
            res.json(null);
        }
    } catch (error) {
        console.error('Error cargando:', error);
        res.status(500).json({ success: false, message: 'Error interno al cargar' });
    }
});

// Ruta SPA (Siempre al final para que React maneje las rutas)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor Finanzas corriendo en puerto ${PORT}`);
});
