import { $Enums } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CreateIngredientDTO } from './ingredient.dto';
export class CreateProductDTO {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  description: string;
  @IsNotEmpty()
  @IsNumber()
  price: number;
  @IsNotEmpty()
  @IsNumber()
  amount: number;
  suplier?: string;
  @IsNotEmpty()
  category: $Enums.Category;
  @IsNotEmpty()
  @IsNumber()
  ingredientIds: [number];
}
export interface ProductDTO {
  name: string;
  description: string;
  price: number;
  amount: number;
  suplier?: string;
  category: $Enums.Category;
  ingredients: CreateIngredientDTO[];
}
