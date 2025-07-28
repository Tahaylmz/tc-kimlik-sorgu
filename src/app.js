const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');
const verificationRoutes = require('./routes/verificationRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Debug middleware
app.use((req, res, next) => {
    console.log('Incoming Request:', {
        method: req.method,
        path: req.path,
        body: req.body,
        headers: req.headers,
        rawBody: req.rawBody
    });
    next();
});

// Statik dosyalar
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api', verificationRoutes);

// Error handler
app.use(errorHandler);

// Ana sayfa
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

const PORT = process.env.PORT || 3001;

// Test ortamında server başlatma
let server;
if (process.env.NODE_ENV !== 'test') {
    // Sunucuyu başlat
    server = app.listen(PORT, () => {
        console.log(`Server ${PORT} portunda çalışıyor`);
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`Port ${PORT} zaten kullanımda. Lütfen başka bir port deneyin.`);
            process.exit(1);
        } else {
            console.error('Sunucu başlatılırken hata oluştu:', err);
            process.exit(1);
        }
    });
    
    // Graceful shutdown
    process.on('SIGTERM', () => {
        console.log('SIGTERM sinyali alındı. Sunucu kapatılıyor...');
        server.close(() => {
            console.log('Sunucu kapatıldı.');
            process.exit(0);
        });
    });
}

module.exports = app; 