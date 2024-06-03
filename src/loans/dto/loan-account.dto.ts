import { IsInt, IsNumber } from 'class-validator';

export class LoanAccountDto {
  @IsInt()
  loan_id: number;

  @IsInt()
  account_id: number;

  @IsNumber()
  amount: number;
}