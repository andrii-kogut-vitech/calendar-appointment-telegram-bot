import { Request, Response, NextFunction } from 'express';
import { google } from 'googleapis';
import { config } from '../config/config';

export const getAvailability = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const auth = await google.auth.getClient({
            projectId: config.google.projectId,
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY,
            },
            scopes: ['https://www.googleapis.com/auth/calendar'],
        });

        const calendar = google.calendar({ version: 'v3', auth });

        const calendarId = config.google.calendarId;

        const minTime = new Date();
        minTime.setDate(minTime.getDate() + 1);
        minTime.setHours(0, 0, 0, 0);

        const maxTime = new Date();
        maxTime.setDate(maxTime.getDate() + 14);
        maxTime.setHours(0, 0, 0, 0);

        const freebusyQuery = {
            resource: {
                timeMin: minTime.toISOString(),
                timeMax: maxTime.toISOString(),
                timeZone: 'America/Los_Angeles',
                items: [{ id: calendarId }],
            },
        };

        const freebusyResponse = await calendar.freebusy.query(freebusyQuery);

        const busySlots = freebusyResponse.data.calendars[calendarId].busy;

        const availableSlots: Date[] = [];

        let lastCheckedTime = minTime;

        for (const slot of busySlots) {
            const start = new Date(slot.start);
            const end = new Date(slot.end);

            if (lastCheckedTime.getTime() !== start.getTime()) {
                const availableStart = new Date(lastCheckedTime);
                availableStart.setHours(12, 0, 0, 0);
                const availableEnd = new Date(start);
                availableEnd.setHours(12, 0, 0, 0);
                while (availableStart.getTime() < availableEnd.getTime()) {
                    availableSlots.push(new Date(availableStart));
                    availableStart.setDate(availableStart.getDate() + 1);
                }
            }

            lastCheckedTime = end;
        }

        res.json({
            status: 'success',
            data: availableSlots,
        });
    } catch (err) {
        next(err);
    }
};

export const createAppointment = async (req: Request, res: Response, next:
