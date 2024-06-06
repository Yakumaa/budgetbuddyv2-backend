import { Body, Controller, Get, Param, Post, Put, Delete, UseGuards } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto, UpdateAccountDto, TransferBalanceDto } from './dto';
import { GetCurrentUserId } from '../auth/decorator';
import { AtGuard } from '../auth/guard';

@UseGuards(AtGuard)
@Controller('accounts')
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Post()
  async createAccount(
    @GetCurrentUserId() userId: number, 
    @Body() createAccountDto: CreateAccountDto
  ) {
    console.log('createAccountDto:', createAccountDto); // Log incoming DTO
    return this.accountsService.createAccount(userId, createAccountDto);
  }

  @Get()
  async getAccounts(@GetCurrentUserId() userId: number) {
    return this.accountsService.getAccounts(userId);
  }

  @Get('account/:id')
  async getAccountById(@Param('id') id: string, @GetCurrentUserId() userId: number){
    return this.accountsService.getAccountById(+id, userId);
  }

  @Put(':id')
  async updateAccount(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    console.log('updateAccountDto:', updateAccountDto); // Log incoming DTO
    return this.accountsService.updateAccount(+id, updateAccountDto);
  }

  @Delete(':id')
  async deleteAccount(@Param('id') id: string) {
    return this.accountsService.deleteAccount(+id);
  }

  @Post('transfer')
  async transferBalance(
    @GetCurrentUserId() userId: number,
    @Body() transferBalanceDto: TransferBalanceDto) {
    console.log('transferBalanceDto:', transferBalanceDto); // Log incoming DTO
    await this.accountsService.transferBalance(userId, transferBalanceDto);
  }

  @Get('total-balance')
  async getTotalBalance(@GetCurrentUserId() userId: string) {
    return this.accountsService.getTotalBalance(+userId);
  }

  @Get('total-accounts')
  async getTotalAccounts(@GetCurrentUserId() userId: string){
    return this.accountsService.getTotalAccounts(+userId);
  }
}
