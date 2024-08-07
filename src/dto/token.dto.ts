import { ApiResponseProperty } from '@nestjs/swagger';

export class TokenDTO {
  @ApiResponseProperty()
  access_token: string;
  @ApiResponseProperty()
  expireIn: number;
  employeeId: number;
}
