import { IsInt, IsNumber } from 'class-validator';

export class TransferBalanceDto {
  //TODO: make this account name instead of id
  @IsInt()
  fromAccountId: number;

  @IsInt()
  toAccountId: number;

  @IsNumber()
  amount: number;
}