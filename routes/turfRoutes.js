import express from 'express';
import {
  createTurf,
  getAllTurfs,
  updateTurf,
  deleteTurf,
  getTurfById,
  createTurfReview,
  searchTurfs
} from '../controllers/turfController.js';

import { getAvailableSlots } from '../controllers/getAvailableSlots.js';
import generateSlots from '../utils/slots.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// 👉 STATIC/FIXED ROUTES (MUST COME FIRST)
router.get('/search', searchTurfs);
router.get('/:turfId/available-slots', getAvailableSlots);
router.get('/slots', (req, res) => {
  res.json(generateSlots());
});

// 👉 MAIN TURF ROUTES
router.route('/')
  .get(protect, getAllTurfs)
  .post(protect, createTurf);

router.route('/:id')
  .get(getTurfById)
  .put(protect, updateTurf)
  .delete(protect, deleteTurf);

router.post('/:id/reviews', protect, createTurfReview);

export default router;
