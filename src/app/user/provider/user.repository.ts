import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ulid } from 'ulid';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async uniquePhone(phone_number: string) {
    const exist = await this.prisma.user.findUnique({
      select: { user_id: true },
      where: { phone_number },
    });
    return exist;
  }

  async createUser(info: Omit<Prisma.UserUncheckedCreateInput, 'user_id'>) {
    const newUser = await this.prisma.user.create({
      data: {
        user_id: ulid(),
        ...info,
      },
    });
    return newUser;
  }

  async findOneUser(info: Prisma.UserWhereInput) {
    const user = await this.prisma.user.findFirst({ where: info });
    return user;
  }

  async getUserList() {
    const users = await this.prisma.user.findMany({
      where: {
        //status: 'ACTIVE',
      },
    });
    return users;
  }
}
