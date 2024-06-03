import { IsInt, IsNotEmpty } from 'class-validator';

export class AccountTransactionDto {
  //TODO: use account name insted of id
  @IsInt()
  @IsNotEmpty()
  account_id: number;
}