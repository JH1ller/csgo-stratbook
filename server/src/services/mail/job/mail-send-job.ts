export interface MailSendJob {
  email: string;

  subject: string;

  context: Record<string, unknown>;

  template: string;
}
