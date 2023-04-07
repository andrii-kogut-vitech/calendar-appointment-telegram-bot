import express from 'express';
import { createAppointment, getAvailability } from '../controllers/appointmentController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/availability', authMiddleware, getAvailability);
router.post('/', authMiddleware, createAppointment);

export { router as appointmentRoutes };
