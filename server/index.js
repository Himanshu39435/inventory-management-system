require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const itemRoutes = require('./routes/itemRoutes');
const authRoutes = require('./routes/authRoutes');
const warehouseRoutes = require('./routes/warehouseRoutes');
const forecastRoutes = require('./routes/forecastRoutes');
const reorderRoutes = require('./routes/reorderRoutes');
const analyticsRoutes = require('./routes/analytics');
const authController = require('./controllers/authController');

const app = express();

/* ==============================
   ✅ CORS CONFIG (IMPORTANT)
============================== */

const allowedOrigins = [
  'http://localhost:3000',
  'https://inventory-management-system-pi-nine.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());

/* ==============================
   ✅ MIDDLEWARE
============================== */

app.use(express.json());

/* ==============================
   ✅ ROUTES
============================== */

app.use('/api', itemRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/forecast', forecastRoutes);
app.use('/api/reorder', reorderRoutes);
app.use('/api/analytics', analyticsRoutes);

app.post('/api/auth/reset-password', authController.resetPassword);

/* ==============================
   ✅ DATABASE CONNECTION
============================== */

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
  family: 4
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

/* ==============================
   ✅ SERVER START (Render)
============================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
