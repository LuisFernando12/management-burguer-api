import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import {
  ProductDTO as ProductDTO,
  ResponseProductDTO,
} from '../dto/product.dto';
import { AuthGuard } from '../guard/auth.guard';
import { ProductService } from '../service/product.service';

type Category = 'FOOD' | 'DRINK' | 'DESSERT';

@Controller('/product')
@ApiTags('Product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Post('/')
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({ type: ResponseProductDTO })
  async create(@Body() body: ProductDTO): Promise<ProductDTO> {
    return await this.productService.create(body);
  }
  @Get('/')
  @ApiCreatedResponse({ type: [ResponseProductDTO] })
  async findAll(): Promise<ResponseProductDTO[]> {
    return await this.productService.find();
  }

  @Get('/category/:category')
  @ApiCreatedResponse({ type: [ResponseProductDTO] })
  async findByCategory(
    @Param('category') category: Category,
  ): Promise<ResponseProductDTO[]> {
    return await this.productService.findByCategory(
      category.toUpperCase() as Category,
    );
  }

  @Get('/:id')
  @ApiCreatedResponse({ type: ResponseProductDTO })
  async findOne(@Param('id') id: number): Promise<ResponseProductDTO> {
    if (id) {
      return await this.productService.get(Number(id));
    }
    throw new BadRequestException();
  }
  @Put('/:id')
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({ type: ResponseProductDTO })
  async update(
    @Body() body: Partial<ProductDTO>,
    @Param('id') id: number,
  ): Promise<ResponseProductDTO> {
    if (id) {
      return await this.productService.update(body, Number(id));
    }
    throw new BadRequestException();
  }
  @Delete('/:id')
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({ type: String })
  async delete(@Param('id') id: number): Promise<string> {
    if (id) {
      return await this.productService.delete(Number(id));
    }
    throw new BadRequestException();
  }
}
