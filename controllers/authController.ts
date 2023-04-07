import { Request, Response } from 'express';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { env } from '../config/env';

const oauth2Client = new OAuth2Client({
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    redirectUri: env.GOOGLE_REDIRECT_URI,
});

const scopes = [
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar.events',
];

export const authController = {
    startAuthFlow: async (req: Request, res: Response) => {
        // Generate the authorization URL and redirect the user to it
        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
        });

        res.redirect(authUrl);
    },

    completeAuthFlow: async (req: Request, res: Response) => {
        const { code } = req.query;

        try {
            // Exchange the authorization code for an access token and refresh token
            const { tokens } = await oauth2Client.getToken(code as string);
            req.session.tokens = tokens;

            // Redirect the user back to the app
            res.redirect('/appointments');
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error completing authorization flow' });
        }
    },

    logout: async (req: Request, res: Response) => {
        // Remove the user's session
        req.session = null;

        // Redirect the user to the home page
        res.redirect('/');
    },
};
