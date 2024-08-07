import { Module } from '@nestjs/common';
import { ProductController } from 'src/controller/product.controller';
import { PrismaService } from 'src/service/prisma.service';
import { ProductService } from 'src/service/product.service';
import { RedisService } from 'src/service/redis.service';

@Module({
  controllers: [ProductController],
  providers: [PrismaService, RedisService, ProductService],
})
export class ProductModule {}
