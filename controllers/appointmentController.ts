import { Request, Response } from 'express';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { Appointment } from '../models/appointment';
import { errorHandler } from '../utils/errorHandler';

// Initialize Google OAuth client
const oauth2Client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);

// Function to get available appointment slots from Google Calendar
const getAvailability = async (startTime: string, endTime: string) => {
    // Authorize the client using the Google OAuth API
    oauth2Client.setCredentials({ access_token: process.env.ACCESS_TOKEN, refresh_token: process.env.REFRESH_TOKEN });

    // Initialize Google Calendar API client
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    try {
        // Get events within specified time range
        const eventsData = await calendar.events.list({
            calendarId: 'primary',
            timeMin: startTime,
            timeMax: endTime,
            singleEvents: true,
            orderBy: 'startTime',
        });

        // Filter out events that are massage appointments and map to available appointment slots
        const availability = eventsData.data.items
            ?.filter((event) => !event?.summary?.includes('Massage appointment'))
            .map((event) => {
                const start = event.start?.dateTime ? new Date(event.start.dateTime) : null;
                const end = event.end?.dateTime ? new Date(event.end.dateTime) : null;
                return start && end ? { start, end } : null;
            })
            .filter((slot) => slot !== null);

        return availability;
    } catch (err) {
        throw new Error(errorHandler(err));
    }
};

export const createAppointment = async (req: Request, res: Response) => {
    const chatId = req.body.message.chat.id;
    const selectedTime = req.body.data;

    try {
        // Check availability for selected time slot
        const isAvailable = await isSlotAvailable(selectedTime);

        if (isAvailable) {
            // Add appointment to calendar
            const event = await addEventToCalendar(selectedTime);

            // Send confirmation message
            const responseMessage = `Your appointment on ${new Date(selectedTime).toLocaleString()} has been confirmed.`;
            await telegramBot.sendMessage(chatId, responseMessage);

            res.status(200).send('Appointment confirmed.');
        } else {
            // If selected time is not available, send response with error message
            const responseMessage = `The selected time slot on ${new Date(selectedTime).toLocaleString()} is not available. Please select another time.`;
            await telegramBot.sendMessage(chatId, responseMessage);

            res.status(400).send('Appointment time not available.');
        }
    } catch (error) {
        console.error(`Error creating appointment: ${error.message}`);
        res.status(500).send('Server error.');
    }
};

// Controller function to get available appointment slots and create new appointment
export const bookAppointment = async (req: Request, res: Response) => {
    try {
        // Check if user is authenticated
        const credentials = await getUserCredentials(req);

        if (!credentials) {
            // If not authenticated, redirect to Google authentication URL
            const authUrl = await getAuthUrl();
            return res.redirect(authUrl);
        }

        // Render the book appointment form
        return res.render('book-appointment');
    } catch (error) {
        console.error(`Error rendering book appointment form: ${error.message}`);
        return res.status(500).send('Server error.');
    }
};

export const getUserCredentials = async (req: Request): Promise<OAuth2Client | null> => {
    const session = req.session as SessionData;

    if (!session.credentials) {
        return null;
    }

    const credentials = JSON.parse(session.credentials);

    const oAuth2Client = new google.auth.OAuth2(
        config.googleCalendar.clientId,
        config.googleCalendar.clientSecret,
        config.googleCalendar.redirectUrl
    );

    oAuth2Client.setCredentials(credentials);

    return oAuth2Client;
};