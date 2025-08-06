import express from 'express';
import { getAllManagers } from '../controllers/userController.js';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/managers', protect, isAdmin, getAllManagers);

export default router;
