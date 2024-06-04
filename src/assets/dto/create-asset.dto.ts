import { IsString, IsNumber, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAssetDto {
  @IsString()
  name: string;

  @IsNumber()
  value: number;

  @IsDate()
  @Type(() => Date)
  purchase_date: Date;

  @IsOptional()
  @IsString()
  description?: string;
}
