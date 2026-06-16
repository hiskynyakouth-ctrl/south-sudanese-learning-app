const mongoose = require('mongoose');

let connected = false;
let lastError = null;

const getMongoUri = () => {
  const rawUri = process.env.MONGO_URI || process.env.DATABASE_URL || process.env.MONGODB_URI;
  if (!rawUri) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Missing MongoDB connection string. Set MONGO_URI or DATABASE_URL in backend environment variables.');
    }
    return 'mongodb://localhost:27017/elearning';
  }

  const uri = rawUri.trim().replace(/^['"]|['"]$/g, '');
  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    throw new Error('Invalid MongoDB connection string scheme. It must start with "mongodb://" or "mongodb+srv://".');
  }
  return uri;
};

const connectDB = async () => {
  try {
    const mongoUri = getMongoUri();
    const source = process.env.MONGO_URI ? 'MONGO_URI' : process.env.DATABASE_URL ? 'DATABASE_URL' : process.env.MONGODB_URI ? 'MONGODB_URI' : 'default local URI';
    const conn = await mongoose.connect(mongoUri);
    connected = true;
    lastError = null;
    console.log(`✅ Connected to MongoDB (${source}): ${conn.connection.host}`);
    return true;
  } catch (err) {
    connected = false;
    lastError = err.message;
    console.error('❌ MongoDB connection failed:', err.message);
    // Retry after 15s
    setTimeout(connectDB, 15000);
    return false;
  }
};

const getDbStatus = () => ({
  state: connected ? 1 : 0,
  status: connected ? 'connected' : 'disconnected',
  lastError: lastError,
});

module.exports = { connectDB, getDbStatus, getMongoUri };
