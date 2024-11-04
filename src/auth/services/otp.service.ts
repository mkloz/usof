import { prisma } from '@/db/prisma.client';
import { UnprocessableEntityException } from '@/shared/exceptions/exceptions';
import { Random } from '@/utils/helpers/random';
import { OtpType, Prisma, PrismaClient } from '@prisma/client';

export class OTPService {
  constructor(private readonly prisma: PrismaClient) {}

  async create(userId: number, type: OtpType, activeTill?: Date) {
    return this.prisma.otp.create({
      data: {
        type,
        userId,
        activeTill,
        code: Random.otp().toString(),
      },
    });
  }

  async verify(email: string, code: string, type: OtpType): Promise<void> {
    const otp = await this.prisma.otp.findFirst({
      where: {
        user: { email },
        code,
        type,
        OR: [{ activeTill: null }, { activeTill: { gt: new Date() } }],
      },
    });

    if (!otp) {
      throw new UnprocessableEntityException('Invalid OTP');
    }

    await this.prisma.otp.delete({
      where: {
        id: otp.id,
      },
    });
  }

  async deleteAll(input: Prisma.OtpWhereUniqueInput): Promise<void> {
    await this.prisma.otp.deleteMany({
      where: input,
    });
  }
}
export const otpService = new OTPService(prisma);
