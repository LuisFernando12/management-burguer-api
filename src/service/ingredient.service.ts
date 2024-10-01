import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma } from '@prisma/client';
import { IngredientDTO } from 'src/dto/ingredient.dto';

@Injectable()
export class IngredientService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(body: IngredientDTO): Promise<IngredientDTO> {
    try {
      return await this.prismaService.ingredient.create({ data: body });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async find(): Promise<IngredientDTO[]> {
    return await this.prismaService.ingredient.findMany();
  }
  async get(id: number): Promise<IngredientDTO> {
    const ingredientDB = await this.prismaService.ingredient.findUnique({
      where: { id },
    });
    if (!ingredientDB) {
      throw new NotFoundException('Ingredient not found');
    }
    return ingredientDB;
  }
  async update(
    body: Prisma.IngredientUpdateInput,
    id: number,
  ): Promise<IngredientDTO> {
    try {
      const ingredientDB = await this.prismaService.ingredient.update({
        data: body,
        where: { id },
      });
      return ingredientDB;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async delete(id: number): Promise<string> {
    try {
      await this.prismaService.ingredient.delete({ where: { id } });
      return 'OK';
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
