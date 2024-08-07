import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateIngredientDTO } from 'src/dto/ingredient.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { IngredientService } from 'src/service/ingredient.service';

@Controller('/ingredient')
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}
  @Post('/')
  @UseGuards(AuthGuard)
  async create(@Body() body: CreateIngredientDTO) {
    if (body) {
      try {
        return await this.ingredientService.create(body);
      } catch (error) {
        throw new InternalServerErrorException(error);
      }
    }
    throw new BadRequestException();
  }
  @Get('/')
  @UseGuards(AuthGuard)
  async findAll() {
    try {
      return await this.ingredientService.find();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  @Get('/:id')
  async findOne(@Param('id') id: number) {
    if (id) {
      try {
        return await this.ingredientService.get(Number(id));
      } catch (error) {
        throw new InternalServerErrorException(error);
      }
    }
    throw new BadRequestException('missing ID');
  }
  @Put('/:id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: number, @Body() body: CreateIngredientDTO) {
    if (body && id) {
      try {
        return await this.ingredientService.update(body, Number(id));
      } catch (error) {
        throw new InternalServerErrorException(error);
      }
    }
    throw new BadRequestException('missing Body or ID');
  }
}
