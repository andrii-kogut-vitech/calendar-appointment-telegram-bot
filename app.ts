import express from 'express';
import { config } from './config/config';
import { errorHandler } from './utils/errorHandler';
import { authRoutes } from './routes/authRoutes';
import { appointmentRoutes } from './routes/appointmentRoutes';

const app = express();

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.url}`);
    next();
};

app.use(express.json());
app.use(loggerMiddleware);


// Routes
app.use('/auth', authRoutes);
app.use('/appointments', appointmentRoutes);

// Error handling middleware
app.use(errorHandler);

app.listen(config.port, () => {
    console.log(`Server started on port ${config.port}`);
});