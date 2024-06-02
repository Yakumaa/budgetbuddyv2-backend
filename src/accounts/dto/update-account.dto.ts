import { IsString, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { AccountCategory } from '@prisma/client';

export class UpdateAccountDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  balance?: number;

  @IsOptional()
  @IsEnum(AccountCategory)
  category?: AccountCategory;
}
