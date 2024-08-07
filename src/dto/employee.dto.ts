import { $Enums } from '@prisma/client';
import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class Employee {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsString()
  @IsNotEmpty()
  documentNumber: string;
  @IsString()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsBoolean()
  active: boolean;
  @IsNotEmpty()
  @IsEnum($Enums.Role)
  role: $Enums.Role;
}
