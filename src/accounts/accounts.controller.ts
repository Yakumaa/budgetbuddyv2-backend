import { Body, Controller, Get, Param, Post, Put, Delete } from '@nestjs/common';
import { AccountsService } from './accounts.service';

@Controller('accounts')
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Post()
  async createAccount(@Body() data: any) {
    return this.accountsService.createAccount(data);
  }

  @Get()
  async getAccounts(@Param('userId') userId: number) {
    return this.accountsService.getAccounts(userId);
  }

  @Get(':id')
  async getAccountById(@Param('id') id: number) {
    return this.accountsService.getAccountById(id);
  }

  @Put(':id')
  async updateAccount(@Param('id') id: number, @Body() data: any) {
    return this.accountsService.updateAccount(id, data);
  }

  @Delete(':id')
  async deleteAccount(@Param('id') id: number) {
    return this.accountsService.deleteAccount(id);
  }
}
