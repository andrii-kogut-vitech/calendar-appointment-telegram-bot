"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentController = void 0;
const googleapis_1 = require("googleapis");
const google_auth_library_1 = require("google-auth-library");
const env_1 = require("../config/env");
const googleCalendarApi_1 = require("../utils/googleCalendarApi");
const oauth2Client = new google_auth_library_1.OAuth2Client({
    clientId: env_1.env.GOOGLE_CLIENT_ID,
    clientSecret: env_1.env.GOOGLE_CLIENT_SECRET,
    redirectUri: env_1.env.GOOGLE_REDIRECT_URI,
});
exports.appointmentController = {
    getAvailability: async (req, res) => {
        // Check that the user is authorized to access the calendar API
        if (!req.session || !req.session.tokens) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        // Set up the calendar API client using the user's OAuth2 tokens
        oauth2Client.setCredentials(req.session.tokens);
        const calendar = googleapis_1.google.calendar({ version: 'v3', auth: oauth2Client });
        try {
            // Retrieve the user's calendar events for the next 7 days
            const now = new Date();
            const end = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            const response = await calendar.events.list({
                calendarId: 'primary',
                timeMin: now.toISOString(),
                timeMax: end.toISOString(),
                singleEvents: true,
                orderBy: 'startTime',
            });
            // Parse the response and extract the free time slots
            const events = response.data.items || [];
            const freeSlots = googleCalendarApi_1.googleCalendarApi.getFreeSlots(events);
            // Return the free time slots to the user
            res.json({ slots: freeSlots });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error retrieving availability' });
        }
    },
    createAppointment: async (req, res) => {
        // Check that the user is authorized to access the calendar API
        if (!req.session || !req.session.tokens) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        // Set up the calendar API client using the user's OAuth2 tokens
        oauth2Client.setCredentials(req.session.tokens);
        const calendar = googleapis_1.google.calendar({ version: 'v3', auth: oauth2Client });
        const { startTime, endTime } = req.body;
        try {
            // Create a new event in the user's calendar
            const event = {
                summary: 'Appointment',
                description: 'Scheduled appointment',
                start: {
                    dateTime: startTime,
                    timeZone: 'UTC',
                },
                end: {
                    dateTime: endTime,
                    timeZone: 'UTC',
                },
            };
            const response = await calendar.events.insert({
                calendarId: 'primary',
                resource: event,
            });
            // Return the newly created event to the user
            res.json({ appointment: response.data });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error creating appointment' });
        }
    },
};
//# sourceMappingURL=appointmentController.js.map