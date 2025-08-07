import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { PORT, MONGO_URI } from './config.js';
import authRoutes from './routes/authRoutes.js';
import turfRoutes from './routes/turfRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import userRoutes from './routes/userRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';

const app = express();
app.use(cors());

app.use('/api/payments', paymentRoutes);
app.use('/api/webhook', webhookRoutes); 
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/turfs', turfRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);

// Mongo Connection
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.log('MongoDB Error:', err));
