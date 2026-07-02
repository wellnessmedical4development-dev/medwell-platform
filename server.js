require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./src/app');
const { runMigrations } = require('./src/database/migrate');
const { setIo } = require('./src/controllers/quickRequestController');

const PORT = parseInt(process.env.PORT, 10) || 5000;

async function start() {
  try {
    if (false && (process.env.NODE_ENV !== 'production' || process.env.RUN_MIGRATIONS === 'true')) {
      await runMigrations();
    }

    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket) => {
      console.log('Socket connected:', socket.id);
      socket.on('join:admin', () => { socket.join('admin-room'); });
      socket.on('disconnect', () => { console.log('Socket disconnected:', socket.id); });
    });

    setIo(io);

    server.listen(PORT, () => {
      console.log(`MedWell API running on port ${PORT}`);
      console.log(`Supported languages: ${process.env.SUPPORTED_LANGS || 'ar,fr,en,es'}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
