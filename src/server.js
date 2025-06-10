const app = require('./app');
const config = require('./config/config');

const server = app.listen(config.port, () => {
    console.log(`TC Kimlik API sunucusu ${config.port} portunda çalışıyor`);
    console.log(`Ortam: ${config.env}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM sinyali alındı. Sunucu kapatılıyor...');
    server.close(() => {
        console.log('Sunucu kapatıldı');
        process.exit(0);
    });
}); 