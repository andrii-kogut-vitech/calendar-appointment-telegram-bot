import { google } from 'googleapis';
import { Appointment } from '../models/appointment';
import { User } from '../models/user';

const CALENDAR_TIMEZONE = 'UTC';

export const googleCalendarApi = {
    getFreeSlots: (events: any[]): string[] => {
        // Convert events to an array of appointments
        const appointments = events.map(event => ({
            id: event.id,
            summary: event.summary,
            description: event.description,
            startTime: event.start.dateTime || event.start.date,
            endTime: event.end.dateTime || event.end.date,
        })) as Appointment[];

        // Create an array of time slots for the next 7 days
        const now = new Date();
        const slots = Array.from({ length: 7 }, (_, index) => {
            const date = new Date(now.getTime() + index * 24 * 60 * 60 * 1000);
            return `${date.toISOString().slice(0, 10)}T00:00:00.000Z`;
        });

        // Remove any time slots that conflict with existing appointments
        for (const appointment of appointments) {
            const start = new Date(appointment.startTime);
            const end = new Date(appointment.endTime);

            for (let i = 0; i < slots.length; i++) {
                const slot = new Date(slots[i]);

                if (slot >= start && slot < end) {
                    slots.splice(i, 1);
                    i--;
                }
            }
        }

        // Return the remaining time slots
        return slots;
    },

    createEvent: async (auth: any, event: any) => {
        const calendar = google.calendar({ version: 'v3', auth });

        const resource = {
            summary: event.summary,
            description: event.description,
            start: {
                dateTime: event.startTime,
                timeZone: CALENDAR_TIMEZONE,
            },
            end: {
                dateTime: event.endTime,
                timeZone: CALENDAR_TIMEZONE,
            },
        };

        try {
            const response = await calendar.events.insert({
                calendarId: 'primary',
                resource,
            });

            return response.data.id;
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    getAccessToken: async (user: User) => {
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            `${process.env.SERVER_URL}/auth/callback`,
        );

        oauth2Client.setCredentials({
            access_token: user.tokens.access_token,
            refresh_token: user.tokens.refresh_token,
        });

        try {
            const { data } = await oauth2Client.getAccessToken();

            return data.access_token;
        } catch (error) {
            console.error(error);
            return null;
        }
    },
};
