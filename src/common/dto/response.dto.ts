import { ApiProperty } from "@nestjs/swagger";

export class ResponseDto<T = any> {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;

  @ApiProperty({ required: false })
  data: T;
}
