export const config = {
    port: process.env.PORT || 3000,
    google: {
        projectId: process.env.GOOGLE_PROJECT_ID || '',
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS || '',
        calendarId: process.env.GOOGLE_CALENDAR_ID || '',
    },
    telegram: {
        token: process.env.TELEGRAM_BOT_TOKEN || '',
        chatId: process.env.TELEGRAM_CHAT_ID || '',
    },
};
