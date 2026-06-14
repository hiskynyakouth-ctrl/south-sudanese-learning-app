const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB, getDbStatus } = require('./config/db');

const app = express();

// Connect to PostgreSQL (auto-creates tables)
connectDB();

const allowedOrigins = [
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : []),
  'http://localhost:3000',
  'http://localhost:3002',
  'https://south-sudanese-learning-app-two.vercel.app',
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => res.json({ status: 'ok', message: 'ss-elearning-api is running' }));
app.get('/api', (req, res) => res.json({ status: 'ok', message: 'API root' }));
app.get('/api/health', (req, res) => {
  const db = getDbStatus();
  res.json({ status: 'ok', uptime: process.uptime(), db });
});

app.use('/api/auth',     require('./routes/authRoutes'));
app.use('/api/subjects', require('./routes/subjectRoutes'));
app.use('/api/chapters', require('./routes/chapterRoutes'));
app.use('/api/quizzes',  require('./routes/quizRoutes'));
app.use('/api/chat',     require('./routes/chatRoutes'));
app.use('/api/admin',    require('./routes/adminRoutes'));
app.use('/api/upload',   require('./routes/uploadRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
