import express from 'express';
import { appointmentController } from '../controllers/appointmentController';
import { authMiddleware } from '../middlewares/authMiddleware';

export const appointmentRoutes = express.Router();

appointmentRoutes.get('/availability', authMiddleware, appointmentController.getAvailability);
appointmentRoutes.post('/appointments', authMiddleware, appointmentController.createAppointment);
