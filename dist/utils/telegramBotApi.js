"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.telegramBotApi = void 0;
exports.telegramBotApi = {
    sendMessage: async (bot, chatId, text) => {
        try {
            await bot.sendMessage(chatId, text, { parse_mode: 'MarkdownV2' });
        }
        catch (error) {
            console.error(error);
        }
    },
    sendAppointmentSlots: async (bot, user, slots) => {
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
        }
        catch (error) {
            console.error(error);
        }
    },
    sendAppointmentConfirmation: async (bot, user, appointmentId) => {
        const message = `Your appointment has been scheduled with ID ${appointmentId}.`;
        try {
            await bot.sendMessage(user.id, message);
        }
        catch (error) {
            console.error(error);
        }
    },
};
//# sourceMappingURL=telegramBotApi.js.map