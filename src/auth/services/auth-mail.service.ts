import { mailerService, MailerService } from '@/mailer/mailer.service';

export class AuthMailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendVerificationMail(email: string, code: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Verify your email',
      templatePath: 'templates/verify-email.hbs',
      context: { code },
    });
  }

  async sendPasswordResetMail(
    email: string,
    code: string,
    username: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset your password',
      templatePath: 'templates/reset-password.hbs',
      context: { code, username },
    });
  }
}
export const authMailService = new AuthMailService(mailerService);
