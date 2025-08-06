import express from 'express';
import {
  createTurf,
  getAllTurfs,
  updateTurf,
  deleteTurf,
  searchTurfs
} from '../controllers/turfController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { createTurfReview } from '../controllers/turfController.js';

const router = express.Router();

// All routes protected
router.route('/').get(protect, getAllTurfs).post(protect, createTurf);
router.route('/:id').put(protect, updateTurf).delete(protect, deleteTurf);
router.post('/:id/reviews', protect, createTurfReview);
router.get('/search', searchTurfs);

export default router;
