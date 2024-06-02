import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto, UpdateTransactionDto } from './dto';
import { Transaction, Prisma } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async createTransaction(userId: number, data: CreateTransactionDto): Promise<Transaction> {
    console.log('createTransaction data:', data); // Log incoming data
    const transaction = await this.prisma.transaction.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        type: data.type,
        amount: data.amount,
        category: data.category,
        description: data.description,
        date: data.date,
      },
    });
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