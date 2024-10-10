import { OtpType } from '@prisma/client';
import { otpService, OTPService } from './otp.service';
import { userService, UserService } from '../../user/user.service';
import { authMailService, AuthMailService } from './auth-mail.service';
import { NotFoundException } from '../../utils/exceptions/exceptions';
export const TEN_MINUTES = 1000 * 60 * 10;

export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly otpService: OTPService,
    private readonly authMailService: AuthMailService,
  ) {}
  public async verifyEmail(email: string, code: string) {
    await this.otpService.verify(email, code, OtpType.EMAIL_VERIFICATION);
    await this.userService.verifyEmail(email);
  }

  public async sendEmailVerification(email: string) {
    const user = await this.userService.get({ email });
    if (!user) {
      throw new NotFoundException('User does not exist.');
    }
    const otp = await this.otpService.create(
      user.id,
      OtpType.EMAIL_VERIFICATION,
      new Date(Date.now() + TEN_MINUTES),
    );

    if (!otp) {
      throw new Error('Failed to create OTP');
    }

    await this.authMailService.sendVerificationMail(user.email, otp.code);
  }

  public async sendPasswordReset(email: string) {
    const user = await this.userService.get({ email });

    if (!user) {
      throw new NotFoundException('User does not exist.');
    }
    const otp = await this.otpService.create(user.id, OtpType.PASSWORD_RESET);

    if (!otp) {
      throw new Error('Failed to create OTP');
    }

    await this.authMailService.sendPasswordResetMail(
      user.email,
      otp.code,
      user.fullName,
    );
  }

  public async resetPassword(email: string, code: string, password: string) {
    const user = await this.userService.get({ email });

    await this.otpService.verify(email, code, OtpType.PASSWORD_RESET);
    await this.userService.update(user.id, { password });
  }
}

export const authService = new AuthService(
  userService,
  otpService,
  authMailService,
);
