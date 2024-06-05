import { Module } from '@nestjs/common';
import { ProductController } from 'src/controller/product.controller';
import { PrismaService } from 'src/service/prisma.service';
import { ProductService } from 'src/service/product.service';

@Module({
  controllers: [ProductController],
  providers: [PrismaService, ProductService],
})
export class ProductModule {}
