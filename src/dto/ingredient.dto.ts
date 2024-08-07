import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class IngredientDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;
  @IsNotEmpty()
  @IsEnum($Enums.Type)
  @ApiProperty({
    enum: $Enums.Type,
    default: $Enums.Type.FRUIT,
    description: 'Ingredients category',
  })
  type: $Enums.Type;
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  unitMeasurement: string;
}
