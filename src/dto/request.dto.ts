import { $Enums } from '@prisma/client';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { CreateProductDTO } from './product.dto';
export class CreateRequestDTO {
  @IsNotEmpty()
  @IsNumber()
  clientId: number;
  @IsNumber()
  employeeId?: number;
  @IsNotEmpty()
  @IsNumber()
  productIds: [number];
}
export class RequestDTO {
  createdAt: Date;
  status: $Enums.Status;
  clientId: number;
  employeeId?: number;
  products: Omit<CreateProductDTO, 'ingredientIds'>[];
}
