import {
  IsString,
  IsNumber,
  IsPositive,
  IsArray,
  IsOptional,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  @IsPositive()
  qty: number;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsString()
  photo: string;

  @IsArray()
  @IsOptional()
  categoryIds?: string[];
}
