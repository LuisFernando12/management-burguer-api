import { Module } from '@nestjs/common';
import { IngredientController } from 'src/controller/ingredient.controller';
import { IngredientService } from 'src/service/ingredient.service';
import { PrismaService } from 'src/service/prisma.service';

@Module({
  controllers: [IngredientController],
  providers: [IngredientService, PrismaService],
})
export class IngredientModule {}
