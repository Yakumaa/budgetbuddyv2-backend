import { Body, Controller, Get, Param, Post, Put, Delete } from '@nestjs/common';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Post()
  async createTransaction(@Body() data: any) {
    return this.transactionsService.createTransaction(data);
  }

  @Get()
  async getTransactions(@Param('userId') userId: number) {
    return this.transactionsService.getTransactions(userId);
  }

  @Get(':id')
  async getTransactionById(@Param('id') id: number) {
    return this.transactionsService.getTransactionById(id);
  }

  @Put(':id')
  async updateTransaction(@Param('id') id: number, @Body() data: any) {
    return this.transactionsService.updateTransaction(id, data);
  }

  @Delete(':id')
  async deleteTransaction(@Param('id') id: number) {
    return this.transactionsService.deleteTransaction(id);
  }
}