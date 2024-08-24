import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import {
  IsBoolean,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class EmployeeDTO {
  @IsNumber()
  @IsEmpty()
  id?: number;
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  documentNumber: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  email: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;
  @IsBoolean()
  @ApiProperty()
  active: boolean;
  @IsNotEmpty()
  @IsEnum($Enums.Role)
  @ApiProperty({
    enum: $Enums.Role,
    default: $Enums.Role.EMPLOYEE,
    description: 'Employee role',
  })
  role: $Enums.Role;
}
