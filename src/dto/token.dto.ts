import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TokenDTO {
  @IsString()
  @IsNotEmpty()
  access_token: string;
  @IsNumber()
  @IsNotEmpty()
  expireIn: number;
  @IsNumber()
  @IsNotEmpty()
  employeeId: number;
}
