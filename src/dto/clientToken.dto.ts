import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ClientTokenDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  token: string;
}
