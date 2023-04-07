import express from 'express';
import { authenticate } from '../controllers/authController';

const router = express.Router();

router.get('/authenticate', authenticate);

export { router as authRoutes };
