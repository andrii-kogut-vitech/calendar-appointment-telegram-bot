import TelegramBot from 'node-telegram-bot-api';
import { User } from '../models/user';

export const telegramBotApi = {
    sendMessage: async (bot: TelegramBot, chatId: string, text: string) => {
        try {
            await bot.sendMessage(chatId, text, { parse_mode: 'MarkdownV2' });
        } catch (error) {
            console.error(error);
        }
    },

    sendAppointmentSlots: async (bot: TelegramBot, user: User, slots: string[]) => {
        const message = `Please select a time slot for your appointment:\n\n${slots.map((slot, index) => `${index + 1}. ${slot}`).join('\n')}`;

        try {
            const options = {
                parse_mode: 'MarkdownV2',
                reply_markup: {
                    keyboard: slots.map((slot, index) => [{ text: `${index + 1}` }]),
                    one_time_keyboard: true,
                    resize_keyboard: true,
                },
            };

            await bot.sendMessage(user.id, message, options);
        } catch (error) {
            console.error(error);
        }
    },

    sendAppointmentConfirmation: async (bot: TelegramBot, user: User, appointmentId: string) => {
        const message = `Your appointment has been scheduled with ID ${appointmentId}.`;

        try {
            await bot.sendMessage(user.id, message);
        } catch (error) {
            console.error(error);
        }
    },
};
