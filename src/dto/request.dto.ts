import { $Enums } from '@prisma/client';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { CreateProductDTO } from './product.dto';
export class CreateRequestDTO {
  @IsNotEmpty()
  @IsNumber()
  clientId: number;
  @IsNotEmpty()
  @IsNumber()
  productIds: [number];
}
export class RequestDTO {
  createdAt: Date;
  status: $Enums.Status;
  clientId: number;
  products: Omit<CreateProductDTO, 'ingredientIds'>[];
}
