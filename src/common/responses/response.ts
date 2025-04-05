import { ApiProperty } from "@nestjs/swagger";

export class ResponseAPI<T> {
  @ApiProperty({ example: 'success', description: 'information about the API' })
  public message: string;
  @ApiProperty({ example: [], description: 'result of API' })
  public data: T;
  @ApiProperty({ example: 'true', description: 'is success hit api or no' })
  public success: boolean = false;
}
