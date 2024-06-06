import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccountDto, UpdateAccountDto, TransferBalanceDto } from './dto';
import { Account } from '@prisma/client';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async createAccount(userId: number, data: CreateAccountDto): Promise<Account> {
    console.log('createAccount data:', data); // Log incoming data
    const account = await this.prisma.account.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        name: data.name,
        balance: data.balance,
        category: data.category,
      },
    });
    console.log('Created account:', account); // Log created account
    return account;
  }
  async getAccounts(userId: number): Promise<{ userId: number; accounts: Account[]; totalBalance: number }> {
    const accounts = await this.prisma.account.findMany({
      where: { user_id: userId },
    });
    console.log('Retrieved accounts:', accounts); // Log retrieved accounts
  
    const { _sum } = await this.prisma.account.aggregate({
      where: { user_id: userId },
      _sum: {
        balance: true,
      },
    });
  
    const totalBalance = _sum.balance || 0;
  
    return { userId, accounts, totalBalance };
  }

  async getAccountById(account_id: number, user_id: number): Promise<Account> {
    const account = await this.prisma.account.findUnique({
      where: { account_id, user_id: user_id},
    });
    console.log('Retrieved account:', account); // Log retrieved account
    return account;
  }

  async updateAccount(account_id: number, data: UpdateAccountDto): Promise<Account> {
    console.log('updateAccount data:', data); // Log incoming data
    const account = await this.prisma.account.update({
      where: { account_id },
      data,
    });
    console.log('Updated account:', account); // Log updated account
    return account;
  }

  async deleteAccount(account_id: number): Promise<Account> {
    const account = await this.prisma.account.delete({
      where: { account_id },
    });
    console.log('Deleted account:', account); // Log deleted account
    return account;
  }

  async transferBalance(userId: number, data: TransferBalanceDto): Promise<void> {
    console.log('transferBalance data:', data); // Log incoming data

    const fromAccount = await this.prisma.account.findUnique({
      where: { account_id: data.fromAccountId },
    });

    const toAccount = await this.prisma.account.findUnique({
      where: { account_id: data.toAccountId },
    });

    if (!fromAccount || !toAccount) {
      throw new BadRequestException('One or both accounts not found');
    }

    if (fromAccount.user_id !== userId || toAccount.user_id !== userId) {
      throw new BadRequestException('Unauthorized action');
    }

    if (fromAccount.balance < data.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    await this.prisma.$transaction([
      this.prisma.account.update({
        where: { account_id: data.fromAccountId },
        data: { balance: { decrement: data.amount } },
      }),
      this.prisma.account.update({
        where: { account_id: data.toAccountId },
        data: { balance: { increment: data.amount } },
      }),
    ]);

    console.log('Balance transferred successfully'); // Log success
  }

  async getTotalBalance(userId: number): Promise<number> {
    const { _sum } = await this.prisma.account.aggregate({
      where: { user_id: userId },
      _sum: {
        balance: true,
      },
    });
  
    const totalBalance = _sum.balance || 0;
  
    return totalBalance;
  }

  async getTotalAccounts(userId: number): Promise<number> {
    const totalAccounts = await this.prisma.account.count({
      where: { user_id: userId },
    });
    
    return totalAccounts;
  }
    
}
