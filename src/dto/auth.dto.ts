import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
  @ApiProperty()
  documentNumber: string;
  @ApiProperty()
  password: string;
}
