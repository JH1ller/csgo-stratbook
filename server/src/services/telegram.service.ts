import TelegramBot from 'node-telegram-bot-api';

export class TelegramService {
  private static instance: TelegramService;
  private botInstance!: TelegramBot;
  private userId!: number;

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
  }

  send(msg: string) {
    this.botInstance.sendMessage(this.userId, msg);
  }
}
