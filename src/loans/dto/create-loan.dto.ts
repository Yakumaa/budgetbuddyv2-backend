import { IsString, IsEnum, IsNumber, IsDate, IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { LoanType } from '@prisma/client';

export class CreateLoanDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsEnum(LoanType)
  @IsNotEmpty()
  loanType: LoanType;

  @IsString()
  @IsNotEmpty()
  counterpart: string;

  @IsNumber()
  @IsOptional()
  interest_rate?: number;

  @IsString()
  @IsOptional()
  repayment_schedule?: string;  //TODO: make this date

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  start_date?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  end_date?: Date;

  @IsNumber()
  account_id: number; // Account to deposit/withdraw loan amount
}