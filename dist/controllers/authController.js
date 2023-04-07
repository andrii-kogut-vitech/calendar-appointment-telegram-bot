"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const google_auth_library_1 = require("google-auth-library");
const env_1 = require("../config/env");
const oauth2Client = new google_auth_library_1.OAuth2Client({
    clientId: env_1.env.GOOGLE_CLIENT_ID,
    clientSecret: env_1.env.GOOGLE_CLIENT_SECRET,
    redirectUri: env_1.env.GOOGLE_REDIRECT_URI,
});
const scopes = [
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar.events',
];
exports.authController = {
    startAuthFlow: async (req, res) => {
        // Generate the authorization URL and redirect the user to it
        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
        });
        res.redirect(authUrl);
    },
    completeAuthFlow: async (req, res) => {
        const { code } = req.query;
        try {
            // Exchange the authorization code for an access token and refresh token
            const { tokens } = await oauth2Client.getToken(code);
            req.session.tokens = tokens;
            // Redirect the user back to the app
            res.redirect('/appointments');
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error completing authorization flow' });
        }
    },
    logout: async (req, res) => {
        // Remove the user's session
        req.session = null;
        // Redirect the user to the home page
        res.redirect('/');
    },
};
//# sourceMappingURL=authController.js.map