import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class EmployeeDTO {
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
