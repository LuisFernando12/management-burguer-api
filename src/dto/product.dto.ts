import { $Enums } from '@prisma/client';
import { IsEmpty, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { IngredientDTO } from './ingredient.dto';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
export class ProductDTO {
  @IsEmpty()
  @IsNumber()
  id?: number;
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;
  @IsString()
  @ApiProperty()
  image: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  description: string;
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  price: number;
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  amount: number;
  @IsString()
  @ApiProperty()
  suplier?: string;
  @IsNotEmpty()
  @ApiProperty({
    enum: $Enums.Category,
    default: $Enums.Category.FOOD,
    description: 'Product Category',
  })
  category: $Enums.Category;
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: [Number] })
  ingredientIds: number[];
}
export class ResponseProductDTO {
  @ApiResponseProperty()
  name: string;
  @ApiResponseProperty()
  description: string;
  @ApiResponseProperty()
  price: number;
  @ApiResponseProperty()
  amount: number;
  @ApiResponseProperty()
  suplier?: string;
  @ApiResponseProperty()
  category: $Enums.Category;
  @ApiResponseProperty()
  ingredients: IngredientDTO[];
}
