import { Body, Controller, Get, Param, Post, Put, Delete } from '@nestjs/common';
import { LoansService } from './loans.service';

@Controller('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Post()
  async createLoan(@Body() data: any) {
    return this.loansService.createLoan(data);
  }

  @Get()
  async getLoans(@Param('userId') userId: number) {
    return this.loansService.getLoans(userId);
  }

  @Get(':id')
  async getLoanById(@Param('id') id: number) {
    return this.loansService.getLoanById(id);
  }

  @Put(':id')
  async updateLoan(@Param('id') id: number, @Body() data: any) {
    return this.loansService.updateLoan(id, data);
  }

  @Delete(':id')
  async deleteLoan(@Param('id') id: number) {
    return this.loansService.deleteLoan(id);
  }
}
