import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { createBooking, getUserBookings } from '../controllers/bookingController.js';
import { getManagerBookings } from '../controllers/bookingController.js';
import { isManager } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/my', protect, getUserBookings);
router.get('/manager', protect, isManager, getManagerBookings);


export default router;
