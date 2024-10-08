import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDTO {
  @ApiProperty()
  @IsNotEmpty()
  documentNumber: string;
  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
