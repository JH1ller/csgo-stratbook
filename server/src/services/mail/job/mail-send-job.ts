export interface MailSendJob {
  emailTo: string;

  subject: string;

  context: Record<string, unknown>;

  template: string;
}
