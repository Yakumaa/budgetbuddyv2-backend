import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

  async getTransactions(userId: number): Promise<{ userId: number; transactions: (Omit<Transaction, 'accounts'> & { account_id: number })[] }> {
    const transactions = await this.prisma.transaction.findMany({
      where: { user_id: userId },
      include: {
        accounts: {
          select: {
            account_id: true,
          },
          take: 1, // Ensure only one account is selected per transaction
        },
      },
    });

    // Map to include account_id as a single value and remove the accounts array
    const transactionsWithAccount = transactions.map(transaction => ({
      transaction_id: transaction.transaction_id,
      user_id: transaction.user_id,
      type: transaction.type,
      amount: transaction.amount,
      category: transaction.category,
      description: transaction.description,
      date: transaction.date,
      created_at: transaction.created_at,
      updated_at: transaction.updated_at,
      account_id: transaction.accounts[0]?.account_id || null // Ensure there's an account_id
    }));

    console.log('Retrieved transactions with account_id:', transactionsWithAccount); // Log retrieved transactions
    return { userId, transactions: transactionsWithAccount };
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
    // Check if the transaction exists
    const transaction = await this.prisma.transaction.findUnique({
      where: { transaction_id },
    });

    if (!transaction) {
      throw new BadRequestException('Transaction not found');
    }

    // Delete the transaction; cascading will delete related AccountTransaction entries
    const deletedTransaction = await this.prisma.transaction.delete({
      where: { transaction_id },
    });

    console.log('Deleted transaction:', deletedTransaction); // Log deleted transaction
    return deletedTransaction;
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