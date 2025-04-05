import { IsNotEmpty, Length } from "class-validator";

export class UpdateCategoryDto {
  @IsNotEmpty()
  @Length(2, 100)
  name: string;
}
