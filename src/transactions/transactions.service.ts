import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto, UpdateTransactionDto } from './dto';
import { Transaction, Prisma } from '@prisma/client';

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

  async getTransactions(): Promise<Transaction[]> {
    const transactions = await this.prisma.transaction.findMany();
    console.log('Retrieved transactions:', transactions); // Log retrieved transactions
    return transactions;
  }

  async getTransactionById(transaction_id: number): Promise<Transaction> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { transaction_id },
    });
    console.log('Retrieved transaction:', transaction); // Log retrieved transaction
    return transaction;
  }

  async updateTransaction(transaction_id: number, data: UpdateTransactionDto): Promise<Transaction> {
    console.log('updateTransaction data:', data); // Log incoming data
    const transaction = await this.prisma.transaction.update({
      where: { transaction_id },
      data,
    });
    console.log('Updated transaction:', transaction); // Log updated transaction
    return transaction;
  }

  async deleteTransaction(transaction_id: number): Promise<Transaction> {
    const transaction = await this.prisma.transaction.delete({
      where: { transaction_id },
    });
    console.log('Deleted transaction:', transaction); // Log deleted transaction
    return transaction;
  }
}