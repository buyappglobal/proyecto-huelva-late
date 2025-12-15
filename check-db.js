const mongoose = require('mongoose');
const fs = require('fs');

// Intentar leer .env o .env.local manualmente
let uri = process.env.MONGODB_URI;

if (!uri) {
    const envFiles = ['.env.local', '.env'];
    for (const file of envFiles) {
        if (fs.existsSync(file)) {
            const content = fs.readFileSync(file, 'utf-8');
            // Buscar la línea que empieza por MONGODB_URI
            const match = content.match(/^MONGODB_URI=(.+)$/m);
            if (match) {
                uri = match[1].trim();
                console.log(`📂 Leído de ${file}`);
                break;
            }
        }
    }
}

if (!uri) {
    console.error('❌ Error: No se encontró MONGODB_URI en .env o .env.local');
    process.exit(1);
}

console.log('🔌 Intentando conectar a MongoDB...');

mongoose.connect(uri)
    .then(() => {
        console.log('✅ ¡CONEXIÓN EXITOSA!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('❌ ERROR DE CONEXIÓN:', err.message);
        process.exit(1);
    });