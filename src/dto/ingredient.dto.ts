import { $Enums } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
export class CreateIngredientDTO {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsEnum($Enums.Type)
  type: $Enums.Type;
  @IsNotEmpty()
  @IsString()
  unitMeasurement: string;
}
