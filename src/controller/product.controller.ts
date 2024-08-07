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
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import {
  ProductDTO as ProductDTO,
  ResponseProductDTO,
} from 'src/dto/product.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { ProductService } from 'src/service/product.service';

@Controller('/product')
@ApiTags('Product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Post('/')
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({ type: ResponseProductDTO })
  async create(@Body() body: ProductDTO): Promise<ProductDTO> {
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
  @ApiCreatedResponse({ type: [ResponseProductDTO] })
  async findAll(): Promise<ResponseProductDTO[]> {
    try {
      return await this.productService.find();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  @Get('/:id')
  @ApiCreatedResponse({ type: ResponseProductDTO })
  async findOne(@Param('id') id: number): Promise<ResponseProductDTO> {
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
  @ApiCreatedResponse({ type: ResponseProductDTO })
  async update(
    @Body() body: ProductDTO,
    @Param('id') id: number,
  ): Promise<ResponseProductDTO> {
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
  @ApiCreatedResponse({ type: String })
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
