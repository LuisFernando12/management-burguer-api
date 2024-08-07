import { $Enums } from '@prisma/client';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { ProductDTO } from './product.dto';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
export class RequestDTO {
  @IsNumber()
  @ApiProperty()
  clientId: number;
  @IsNumber()
  @ApiProperty()
  employeeId?: number;
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: [Number] })
  productIds: [number];
}
export class ResponseRequestDTO {
  @ApiResponseProperty()
  createdAt: Date;
  @ApiResponseProperty()
  status: $Enums.Status;
  @ApiResponseProperty()
  clientId: number;
  @ApiResponseProperty()
  employeeId?: number;
  @ApiResponseProperty()
  products: Omit<ProductDTO, 'ingredientIds'>[];
}
