import { IsNotEmpty, IsNumber, IsOptional, Length } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @Length(2, 100)
  name: string;

  @IsOptional()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  stock: number;
}
