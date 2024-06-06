import { Body, Controller, Get, Param, Post, Put, Delete, UseGuards } from '@nestjs/common';
import { LoansService } from './loans.service';
import { CreateLoanDto, UpdateLoanDto } from './dto';
import { GetCurrentUserId } from '../auth/decorator';
import { AtGuard } from '../auth/guard/at.guard';

@Controller('loans')
@UseGuards(AtGuard)
export class LoansController {
  constructor(private loansService: LoansService) {}

  @Post()
  async createLoan(
    @GetCurrentUserId() userId: number,
    @Body() createLoanDto: CreateLoanDto
  ) {
    console.log('createLoanDto:', createLoanDto); // Log incoming DTO
    return this.loansService.createLoan(userId, createLoanDto);
  }

  @Get()
  async getLoans(@GetCurrentUserId() userId: number){
    return this.loansService.getLoans(userId);
  }

  @Get('loan/:id')
  async getLoanById(@Param('id') id: string, @GetCurrentUserId() userId: number){
    return this.loansService.getLoanById(+id, userId);
  }

  @Put(':id')
  async updateLoan(@Param('id') id: string, @Body() updateLoanDto: UpdateLoanDto) {
    console.log('updateLoanDto:', updateLoanDto); // Log incoming DTO
    return this.loansService.updateLoan(+id, updateLoanDto);
  }

  @Delete(':id')
  async deleteLoan(@Param('id') id: string) {
    return this.loansService.deleteLoan(+id);
  }

  @Get('total-lending')
  async getTotalLending(@GetCurrentUserId() userId: string){
    return this.loansService.getTotalLending(+userId);
  }

  @Get('total-borrowing')
  async getTotalBorrowing(@GetCurrentUserId() userId: string){
    return this.loansService.getTotalBorrowing(+userId);
  }
}
