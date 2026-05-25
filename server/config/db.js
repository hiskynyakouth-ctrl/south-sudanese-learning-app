const mongoose = require('mongoose');

let pool = null;
if (process.env.DATABASE_URL) {
  const { Pool } = require('pg');
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
}

let reconnectTimer = null;

const DB_STATES = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
};

const getDbStatus = () => ({
  state: mongoose.connection.readyState,
  status: DB_STATES[mongoose.connection.readyState] || 'unknown',
});

const scheduleReconnect = () => {
  if (reconnectTimer || mongoose.connection.readyState === 1) return;

  reconnectTimer = setTimeout(async () => {
    reconnectTimer = null;
    const connection = await connectDB();
    if (!connection) scheduleReconnect();
  }, 30000);

  if (typeof reconnectTimer.unref === 'function') reconnectTimer.unref();
};

const connectDB = async () => {
  if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
    return mongoose.connection;
  }

  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/elearning';
    await mongoose.connect(uri, { dbName: 'elearning', serverSelectionTimeoutMS: 10000 });
    console.log('Connected to MongoDB');
    return mongoose.connection;
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    scheduleReconnect();
    return null;
  }
};

mongoose.connection.on('disconnected', scheduleReconnect);

module.exports = { connectDB, getDbStatus, pool };
