import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto, UpdateTransactionDto } from './dto';
import { Transaction, Prisma, TransactionType } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async createTransaction(userId: number, data: CreateTransactionDto): Promise<Transaction> {
    console.log('createTransaction data:', data); // Log incoming data
    const { account_transactions, ...transactionData } = data;

    const transaction = await this.prisma.transaction.create({
      data: {
        ...transactionData,
        user: {
          connect: {
            id: userId,
          },
        },
        accounts: {
          create: account_transactions.map((accountTransaction) => ({
            account: {
              connect: {
                account_id: accountTransaction.account_id,
              },
            },
            amount: data.amount,
          })),
        },
      },
    });

    await Promise.all(
      account_transactions.map(async (accountTransaction) => {
        await this.prisma.account.update({
          where: {
            account_id: accountTransaction.account_id,
          },
          data: {
            balance: {
              increment: data.type === 'income' ? data.amount : -data.amount,
            },
          },
        });
      }),
    );

    console.log('Created transaction:', transaction); // Log created transaction
    return transaction;
  }

  async getTransactions(userId: number): Promise<{ userId: number; transactions: Transaction[] }> {
    const transactions = await this.prisma.transaction.findMany({
      where: { user_id: userId },
    });
    console.log('Retrieved transactions:', transactions); // Log retrieved transactions
    return {userId, transactions};
  }

  async getTransactionById(transaction_id: number, user_id: number): Promise<Transaction | null> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { transaction_id, user_id: user_id },
    });
    console.log('Retrieved transaction:', transaction); // Log retrieved transaction
    return transaction;
  }

  async updateTransaction(transaction_id: number, data: UpdateTransactionDto): Promise<Transaction> {
    console.log('updateTransaction data:', data); // Log incoming data
  
    // Retrieve the existing transaction
    const existingTransaction = await this.prisma.transaction.findUnique({
      where: { transaction_id },
      include: { accounts: true },
    });
  
    if (!existingTransaction) {
      throw new NotFoundException('Transaction not found');
    }
  
    // Calculate the balance difference
    const balanceDiff = data.amount - existingTransaction.amount;
  
    // Update the transaction
    const updatedTransaction = await this.prisma.transaction.update({
      where: { transaction_id },
      data: {
        ...data,
        accounts: {
          updateMany: {
            where: { transaction_id },
            data: { amount: data.amount },
          },
        },
      },
    });
  
    // Update the account balances
    await Promise.all(
      existingTransaction.accounts.map(async (accountTransaction) => {
        await this.prisma.account.update({
          where: { account_id: accountTransaction.account_id },
          data: {
            balance: {
              increment: existingTransaction.type === 'income' ? balanceDiff : -balanceDiff,
            },
          },
        });
      }),
    );
  
    console.log('Updated transaction:', updatedTransaction); // Log updated transaction
    return updatedTransaction;
  }

  async deleteTransaction(transaction_id: number): Promise<Transaction> {
    const transaction = await this.prisma.transaction.delete({
      where: { transaction_id },
    });
    console.log('Deleted transaction:', transaction); // Log deleted transaction
    return transaction;
  }
  
  async getTotalIncome(userId: number): Promise<number> {
    const { _sum } = await this.prisma.transaction.aggregate({
      where: {
        user_id: userId,
        type: TransactionType.income,
      },
      _sum: {
        amount: true,
      },
    });
    const totalIncome = _sum.amount || 0;
    console.log('Total income:', totalIncome);
    return totalIncome;
  }

  async getTotalExpense(userId: number): Promise<number> {
    const { _sum } = await this.prisma.transaction.aggregate({
      where: {
        user_id: userId,
        type: TransactionType.expense,
      },
      _sum: {
        amount: true,
      },
    });
    const totalExpense = _sum.amount || 0;
    console.log('Total expense:', totalExpense);
    return totalExpense;
  }
}