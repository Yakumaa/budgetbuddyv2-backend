import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Transaction, Prisma } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async createTransaction(data: any) {
    return this.prisma.transaction.create({ data });
  }

  async getTransactions(userId: number) {
    return this.prisma.transaction.findMany({
      where: { user_id: userId },
    });
  }

  async getTransactionById(id: number) {
    return this.prisma.transaction.findUnique({ where: { transaction_id: id } });
  }

  async updateTransaction(id: number, data: any) {
    return this.prisma.transaction.update({ where: { transaction_id: id }, data });
  }

  async deleteTransaction(id: number) {
    return this.prisma.transaction.delete({ where: { transaction_id: id } });
  }
}