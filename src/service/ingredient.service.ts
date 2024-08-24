import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
    try {
      return await this.prismaService.ingredient.findMany();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async get(id: number): Promise<IngredientDTO> {
    try {
      return await this.prismaService.ingredient.findUnique({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async update(
    body: Prisma.IngredientUpdateInput,
    id: number,
  ): Promise<IngredientDTO> {
    try {
      return await this.prismaService.ingredient.update({
        data: body,
        where: { id },
      });
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
