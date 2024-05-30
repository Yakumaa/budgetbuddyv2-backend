import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LoansService {
  constructor(private prisma: PrismaService) {}

  async createLoan(data: any) {
    return this.prisma.loan.create({ data });
  }

  async getLoans(userId: number) {
    return this.prisma.loan.findMany({
      where: { user_id: userId },
    });
  }

  async getLoanById(id: number) {
    return this.prisma.loan.findUnique({ where: { loan_id: id } });
  }

  async updateLoan(id: number, data: any) {
    return this.prisma.loan.update({ where: { loan_id: id }, data });
  }

  async deleteLoan(id: number) {
    return this.prisma.loan.delete({ where: { loan_id: id } });
  }
}
