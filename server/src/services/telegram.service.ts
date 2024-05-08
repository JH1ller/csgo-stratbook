import TelegramBot from 'node-telegram-bot-api';

import { Logger } from '@/utils/logger';

import { configService } from './config.service';

const logger = new Logger('TelegramService');

class TelegramService {
  private userId?: string;
  private bot?: TelegramBot;

  constructor() {
    const { TELEGRAM_TOKEN, TELEGRAM_USER } = configService.env;
    if (TELEGRAM_TOKEN && TELEGRAM_USER) {
      this.bot = new TelegramBot(TELEGRAM_TOKEN, { polling: false });
      this.userId = TELEGRAM_USER;
      logger.success('initialized');
    } else {
      logger.error('not initialized due to missing token or user');
    }
  }

  send(message: string) {
    if (!this.bot || !this.userId) {
      logger.error('send failed due to missing token or user');
      return;
    }
    this.bot.sendMessage(this.userId, message);
  }
}

const telegramService = new TelegramService();

export { telegramService };
