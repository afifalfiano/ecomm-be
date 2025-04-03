import { IsNotEmpty, Length } from "class-validator";

export class CreateCategoryDto {
  @IsNotEmpty()
  @Length(2, 100)
  name: string;
}
