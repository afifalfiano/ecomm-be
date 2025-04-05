import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, Length, Min } from "class-validator";

export class UpdateProductDto {
  @IsNotEmpty()
  @Length(2, 100)
  @ApiProperty()
  name: string;

  @IsOptional()
  @ApiProperty()
  @ApiPropertyOptional()
  imageUrl: string;

  @IsOptional()
  @ApiProperty()
  @ApiPropertyOptional()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @ApiProperty()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @ApiProperty()
  stock: number;
}
