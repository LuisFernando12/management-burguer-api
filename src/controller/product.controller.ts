import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  CreateProductDTO as CreateProductDTO,
  ProductDTO,
} from 'src/dto/product.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { ProductService } from 'src/service/product.service';

@Controller('/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Post('/')
  @UseGuards(AuthGuard)
  async create(@Body() body: CreateProductDTO): Promise<CreateProductDTO> {
    if (body) {
      try {
        return await this.productService.create(body);
      } catch (error) {
        throw new InternalServerErrorException(error);
      }
    }
    throw new BadRequestException();
  }
  @Get('/')
  async findAll(): Promise<ProductDTO[]> {
    try {
      return await this.productService.find();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  @Get('/:id')
  async findOne(@Param('id') id: number): Promise<ProductDTO> {
    if (id) {
      try {
        return await this.productService.get(Number(id));
      } catch (error) {
        throw new InternalServerErrorException(error);
      }
    }
    throw new BadRequestException('missing ID');
  }
  @Put('/:id')
  @UseGuards(AuthGuard)
  async update(
    @Body() body: CreateProductDTO,
    @Param('id') id: number,
  ): Promise<ProductDTO> {
    if (body && id) {
      try {
        return await this.productService.update(body, Number(id));
      } catch (error) {
        throw new InternalServerErrorException(error);
      }
    }
    throw new BadRequestException('missing Body or ID');
  }
  @Delete('/:id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: number): Promise<string> {
    if (id) {
      try {
        return await this.productService.delete(Number(id));
      } catch (error) {
        throw new InternalServerErrorException(error);
      }
    }
    throw new BadRequestException('missing ID');
  }
}
