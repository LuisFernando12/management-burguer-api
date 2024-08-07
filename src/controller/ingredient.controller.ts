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
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { IngredientDTO } from 'src/dto/ingredient.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { IngredientService } from 'src/service/ingredient.service';

@Controller('/ingredient')
@ApiTags('Ingredient')
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}
  @Post('/')
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({ type: IngredientDTO })
  async create(@Body() body: IngredientDTO): Promise<IngredientDTO> {
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
  @ApiCreatedResponse({ type: [IngredientDTO] })
  async findAll(): Promise<IngredientDTO[]> {
    try {
      return await this.ingredientService.find();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  @Get('/:id')
  @ApiCreatedResponse({ type: IngredientDTO })
  async findOne(@Param('id') id: number): Promise<IngredientDTO> {
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
  @ApiCreatedResponse({ type: IngredientDTO })
  async update(
    @Param('id') id: number,
    @Body() body: IngredientDTO,
  ): Promise<IngredientDTO> {
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
