import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { IngredientDTO } from '../dto/ingredient.dto';
import { AuthGuard } from '../guard/auth.guard';
import { IngredientService } from '../service/ingredient.service';

@Controller('/ingredient')
@ApiTags('Ingredient')
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}
  @Post('/')
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({ type: IngredientDTO })
  async createIngredient(@Body() body: IngredientDTO): Promise<IngredientDTO> {
    if (body) {
      return await this.ingredientService.create(body);
    }
    throw new BadRequestException();
  }
  @Get('/')
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({ type: [IngredientDTO] })
  async findAllIngredient(): Promise<IngredientDTO[]> {
    return await this.ingredientService.find();
  }
  @Get('/:id')
  @ApiCreatedResponse({ type: IngredientDTO })
  async getIngredientById(@Param('id') id: number): Promise<IngredientDTO> {
    if (id) {
      return await this.ingredientService.get(Number(id));
    }
    throw new BadRequestException('missing ID');
  }
  @Put('/:id')
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({ type: IngredientDTO })
  async updateIngredient(
    @Param('id') id: number,
    @Body() body: IngredientDTO,
  ): Promise<IngredientDTO> {
    if (body && id) {
      return await this.ingredientService.update(body, Number(id));
    }
    throw new BadRequestException('Invalid params');
  }
}
