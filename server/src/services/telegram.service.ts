import TelegramBot from 'node-telegram-bot-api';

export class TelegramService {
  private static instance: TelegramService;
  private botInstance!: TelegramBot;
  private userId!: number;
  private initialized = false;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static getInstance(): TelegramService {
    if (!TelegramService.instance) {
      TelegramService.instance = new TelegramService();
    }
    return TelegramService.instance;
  }

  init(token: string, userId: string) {
    this.botInstance = new TelegramBot(token, { polling: true });
    this.userId = +userId;
    this.initialized = true;
  }

  send(msg: string) {
    if (!this.initialized) return;

    this.botInstance.sendMessage(this.userId, msg);
  }
}
