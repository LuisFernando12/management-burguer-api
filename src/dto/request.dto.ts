import { $Enums } from '@prisma/client';
import { IsArray, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ProductDTO } from './product.dto';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
export class RequestDTO {
  @IsNumber()
  @ApiProperty()
  clientId: number;
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  employeeId?: number;
  @IsNotEmpty()
  @IsArray()
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
