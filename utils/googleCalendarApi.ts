import { google } from 'googleapis';
import { config } from '../config/config';

const auth = google.auth.getClient({
    projectId: config.google.projectId,
    credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY,
    },
    scopes: ['https://www.googleapis.com/auth/calendar'],
});

export const calendar = google.calendar({ version: 'v3', auth });
