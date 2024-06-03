import { IsString, IsEnum, IsNumber, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { LoanType } from '@prisma/client';

export class UpdateLoanDto {
  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsEnum(LoanType)
  loanType?: LoanType;

  @IsOptional()
  @IsString()
  counterpart?: string;

  @IsOptional()
  @IsNumber()
  interest_rate?: number;

  @IsOptional()
  @IsString()
  repayment_schedule?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  start_date?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  end_date?: Date;
}