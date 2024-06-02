import { IsString, IsEnum, IsNumber } from 'class-validator';
import { AccountCategory } from '@prisma/client';

export class CreateAccountDto {
  @IsString()
  name: string;

  @IsNumber()
  balance: number;

  @IsEnum(AccountCategory)
  category: AccountCategory;
}