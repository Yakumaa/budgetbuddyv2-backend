import { Body, Controller, Get, Param, Post, Put, Delete, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto, UpdateTransactionDto } from './dto';
import { GetCurrentUserId } from '../auth/decorator';
import { AtGuard } from '../auth/guard';

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @UseGuards(AtGuard) //TODO: try this globally
  @Post()
  async createTransaction(
    @GetCurrentUserId() userId: number,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    console.log('createTransactionDto:', createTransactionDto); // Log incoming DTO
    return this.transactionsService.createTransaction(userId, createTransactionDto);
  }

  @Get()
  async getTransactions(@GetCurrentUserId() userId: number) {
    return this.transactionsService.getTransactions(userId);
  }

  @Get('transaction/:id')
  async getTransactionById(@Param('id') id: string, @GetCurrentUserId() userId: number){
    return this.transactionsService.getTransactionById(+id, userId);
  }

  @Put(':id')
  async updateTransaction(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
    console.log('updateTransactionDto:', updateTransactionDto); // Log incoming DTO
    return this.transactionsService.updateTransaction(+id, updateTransactionDto);
  }

  @Delete(':id')
  async deleteTransaction(@Param('id') id: string) {
    return this.transactionsService.deleteTransaction(+id);
  }

  @Get('total-income')
  async getTotalIncome(@GetCurrentUserId() userId: string){
    return this.transactionsService.getTotalIncome(+userId);
  }

  @Get('total-expense')
  async getTotalExpense(@GetCurrentUserId() userId: string){
    return this.transactionsService.getTotalExpense(+userId);
  }
}