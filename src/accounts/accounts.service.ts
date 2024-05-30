import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaService) {}

  async createAccount(data: any) {
    return this.prisma.account.create({ data });
  }

  async getAccounts(userId: number) {
    return this.prisma.account.findMany({
      where: { user_id: userId },
    });
  }

  async getAccountById(id: number) {
    return this.prisma.account.findUnique({ where: { account_id: id } });
  }

  async updateAccount(id: number, data: any) {
    return this.prisma.account.update({ where: { account_id: id }, data });
  }

  async deleteAccount(id: number) {
    return this.prisma.account.delete({ where: { account_id: id } });
  }
}
