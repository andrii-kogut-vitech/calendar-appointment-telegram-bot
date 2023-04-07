import TelegramBot from 'node-telegram-bot-api';
import { config } from '../config/config';

const bot = new TelegramBot(config.telegram.token, { polling: true });

export const sendTelegramMessage = async (message: string) => {
    try {
        await bot.sendMessage(config.telegram.chatId, message);
    } catch (err) {
        console.error(err);
    }
};
