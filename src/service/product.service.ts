import { RedisService } from './redis.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma } from '@prisma/client';
import { ProductDTO, ResponseProductDTO } from 'src/dto/product.dto';

type ProductCreateInput = Prisma.ProductCreateInput & {
  ingredientIds: number[];
};

type Category = 'FOOD' | 'DRINK' | 'DESSERT';

@Injectable()
export class ProductService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async create(body: ProductCreateInput): Promise<ProductDTO> {
    try {
      const { ingredientIds, ...data } = body;
      const productDB = await this.prismaService.product.create({ data });
      ingredientIds.forEach(async (ingredientId) => {
        await this.prismaService.productIngredient.create({
          data: { productId: productDB.id, ingredientId: ingredientId },
        });
      });
      return { ...productDB, ingredientIds };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async find(): Promise<ResponseProductDTO[]> {
    try {
      const productCache = await this.redisService.get('products');
      if (!productCache) {
        const productDB = await this.prismaService.product.findMany({
          include: {
            ingredients: {
              include: {
                ingredient: true,
              },
            },
          },
        });

        await this.redisService.setex(
          'products',
          300,
          JSON.stringify(productDB),
        );
        console.log('DataBase');

        return productDB.map((product) => {
          const { ingredients, ...productDB } = product;
          return {
            ...productDB,
            ingredients: ingredients.map((ingredient) => ingredient.ingredient),
          };
        });
      }
      console.log('Cache');
      return JSON.parse(productCache).map((product) => {
        const { ingredients, ...productDB } = product;
        return {
          ...productDB,
          ingredients: ingredients.map((ingredient) => ingredient.ingredient),
        };
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findByCategory(category: Category): Promise<ResponseProductDTO[]> {
    try {
      const productCache = await this.redisService.get(`products[${category}]`);
      if (!productCache) {
        const productDB = await this.prismaService.product.findMany({
          where: { category },
          include: {
            ingredients: {
              include: {
                ingredient: true,
              },
            },
          },
        });
        await this.redisService.setex(
          `products[${category}]`,
          300,
          JSON.stringify(productDB),
        );
        return productDB.map((product) => {
          const { ingredients, ...productDB } = product;
          return {
            ...productDB,
            ingredients: ingredients.map((ingredient) => ingredient.ingredient),
          };
        });
      }
      return JSON.parse(productCache).map((product) => {
        const { ingredients, ...productDB } = product;
        return {
          ...productDB,
          ingredients: ingredients.map((ingredient) => ingredient.ingredient),
        };
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async get(id: number): Promise<ResponseProductDTO> {
    try {
      const productDB = await this.prismaService.product.findUnique({
        where: { id },
        include: {
          ingredients: {
            include: {
              ingredient: true,
            },
          },
        },
      });
      return {
        ...productDB,
        ingredients: productDB.ingredients.map(({ ingredient }) => ingredient),
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async update(
    body: Prisma.ProductUpdateInput,
    id: number,
  ): Promise<ResponseProductDTO> {
    try {
      const productDB = await this.prismaService.product.update({
        data: body,
        where: { id },
        include: {
          ingredients: {
            include: {
              ingredient: true,
            },
          },
        },
      });
      const { ingredients, ...data } = productDB;
      return {
        ...data,
        ingredients: ingredients.map(({ ingredient }) => ingredient),
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async delete(id: number): Promise<string> {
    try {
      await this.prismaService.product.delete({
        where: { id },
      });
      return 'ok';
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
