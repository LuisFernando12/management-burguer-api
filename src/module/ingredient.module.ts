import { Module } from '@nestjs/common';
import { IngredientController } from 'src/controller/ingredient.controller';
import { IngredientService } from 'src/service/ingredinet.service';
import { PrismaService } from 'src/service/prisma.service';

@Module({
  controllers: [IngredientController],
  providers: [IngredientService, PrismaService],
})
export class IngredientModule {}
