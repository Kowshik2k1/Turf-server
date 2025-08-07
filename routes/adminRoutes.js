import express from 'express';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllTurfs,
  createTurf,
  updateTurf,
  deleteTurf,
} from '../controllers/adminController.js';

const router = express.Router();

router.use(protect, isAdmin);

// Users
router.get('/users', getAllUsers);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Turfs
router.get('/turfs', getAllTurfs);
router.post('/turfs', createTurf);
router.put('/turfs/:id', updateTurf);
router.delete('/turfs/:id', deleteTurf);

export default router;
