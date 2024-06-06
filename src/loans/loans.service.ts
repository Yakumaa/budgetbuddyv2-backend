import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLoanDto, UpdateLoanDto, LoanAccountDto } from './dto';
import { Loan, LoanType } from '@prisma/client';

@Injectable()
export class LoansService {
  constructor(private prisma: PrismaService) {}

  async createLoan(userId: number, data: CreateLoanDto): Promise<Loan> {
    console.log('createLoan data:', data); // Log incoming data

    const account = await this.prisma.account.findUnique({
      where: { account_id: data.account_id },
    });

    if (!account) {
      throw new BadRequestException('Account not found');
    }

    if (account.user_id !== userId) {
      throw new BadRequestException('Unauthorized action');
    }

    const loan = await this.prisma.loan.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        amount: data.amount,
        loanType: data.loanType,
        counterpart: data.counterpart,
        interest_rate: data.interest_rate,
        repayment_schedule: data.repayment_schedule,
        start_date: data.start_date,
        end_date: data.end_date,
        accounts: {
          create: {
            account_id: data.account_id,
            amount: data.amount,
          },
        },
      },
    });

    if (data.loanType === LoanType.borrow) {
      await this.prisma.account.update({
        where: { account_id: data.account_id },
        data: { balance: { increment: data.amount } },
      });
    } else if (data.loanType === LoanType.lend) {
      if (account.balance < data.amount) {
        throw new BadRequestException('Insufficient balance');
      }
      await this.prisma.account.update({
        where: { account_id: data.account_id },
        data: { balance: { decrement: data.amount } },
      });
    }

    console.log('Created loan:', loan); // Log created loan
    return loan;
  }

  async getLoans(userId: number): Promise<Loan[]> {
    const loans = await this.prisma.loan.findMany({
      where: { user_id: userId },
    });
    console.log('Retrieved loans:', loans); // Log retrieved loans
    return loans;
  }

  async getLoanById(loanId: number, user_id: number): Promise<Loan> {
    const loan = await this.prisma.loan.findUnique({
      where: { loan_id: loanId, user_id: user_id},
    });
    console.log('Retrieved loan:', loan); // Log retrieved loan
    return loan;
  }

  async updateLoan(loanId: number, data: UpdateLoanDto): Promise<Loan> {
    console.log('updateLoan data:', data); // Log incoming data
    
    // Retrieve the existing loan with associated accounts
    const existingLoan = await this.prisma.loan.findUnique({
      where: { loan_id: loanId },
      include: { accounts: true },
    });

    if (!existingLoan) {
      throw new NotFoundException('Loan not found');
    }

    // Calculate the balance difference
    const balanceDiff = data.amount - existingLoan.amount;

    const updatedLoan = await this.prisma.loan.update({
      where: { loan_id: loanId },
      data: {
        ...data,
        accounts: {
          updateMany: {
            where: { loan_id: loanId },
            data: { amount: data.amount },
          },
        },
      },
    });

    // Update the account balances
    await Promise.all(
      existingLoan.accounts.map(async (accountLoan) => {
        await this.prisma.account.update({
          where: { account_id: accountLoan.account_id },
          data: {
            balance: { 
              increment: existingLoan.loanType === LoanType.borrow ? balanceDiff : -balanceDiff
            },
          },
        });
      }),
    );

    console.log('Updated loan:', updatedLoan); // Log updated loan
    return updatedLoan;
  }

  async deleteLoan(loanId: number): Promise<Loan> {
    const loan = await this.prisma.loan.findUnique({
      where: { loan_id: loanId },
      include: { accounts: true }, // Include associated accounts
    });
  
    if (!loan) {
      throw new NotFoundException('Loan not found');
    }

    // Update account balances before deleting the loan
    await Promise.all(
      loan.accounts.map(async (loanAccount) => {
        const account = await this.prisma.account.findUnique({
          where: { account_id: loanAccount.account_id },
        });

        if (loan.loanType === LoanType.borrow) {
          await this.prisma.account.update({
            where: { account_id: loanAccount.account_id },
            data: { balance: { decrement: loan.amount } },
          });
        } else if (loan.loanType === LoanType.lend) {
          await this.prisma.account.update({
            where: { account_id: loanAccount.account_id },
            data: { balance: { increment: loan.amount } },
          });
        }
      }),
    );
  
    // Delete associated LoanAccount records
    await this.prisma.loanAccount.deleteMany({
      where: { loan_id: loanId },
    });
  
    // Delete the loan
    const deletedLoan = await this.prisma.loan.delete({
      where: { loan_id: loanId },
    });
  
    console.log('Deleted loan:', deletedLoan); // Log deleted loan
    return deletedLoan;
  }

  async getTotalLending(userId: number): Promise<number> {
    const { _sum } = await this.prisma.loan.aggregate({
      where: {
        user_id: userId,
        loanType: LoanType.lend,
      },
      _sum: {
        amount: true,
      },
    });
    const totalLending = _sum.amount || 0;
    console.log('Total lending:', totalLending); // Log total lending
    return totalLending;
  }

  async getTotalBorrowing(userId: number): Promise<number> {
    const { _sum } = await this.prisma.loan.aggregate({
      where: {
        user_id: userId,
        loanType: LoanType.borrow,
      },
      _sum: {
        amount: true,
      },
    });
    const totalBorrowing = _sum.amount || 0;
    console.log('Total borrowing:', totalBorrowing); // Log total borrowing
    return totalBorrowing;
  }
}
