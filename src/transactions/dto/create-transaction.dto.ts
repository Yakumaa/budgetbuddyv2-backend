import { IsInt, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { TransactionType } from '@prisma/client';
import { Type } from 'class-transformer';
import { AccountTransactionDto } from './account-transaction.dto';

export class CreateTransactionDto {
  @IsEnum(TransactionType)
  @IsNotEmpty()
  type: TransactionType; //income / expense

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  //TODO: add pre made categories and option to add more categories
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  category: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  description?: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => AccountTransactionDto)
  account_transactions: AccountTransactionDto[];
}

