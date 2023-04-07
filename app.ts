import express from 'express';
import { config } from './config/config';
import { errorHandler } from './utils/errorHandler';
import { authRoutes } from './routes/authRoutes';
import { appointmentRoutes } from './routes/appointmentRoutes';

const app = express();

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/appointment', appointmentRoutes);

app.use(errorHandler);

app.listen(config.port, () => {
    console.log(`App is listening on port ${config.port}`);
});
