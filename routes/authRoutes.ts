import express from 'express';
import { authController } from '../controllers/authController';

export const authRoutes = express.Router();

authRoutes.get('/start', authController.startAuthFlow);
authRoutes.get('/complete', authController.completeAuthFlow);
authRoutes.get('/logout', authController.logout);
