import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma } from '@prisma/client';
import { CreateProductDTO, ProductDTO } from 'src/dto/product.dto';

type ProductCreateInput = Prisma.ProductCreateInput & {
  ingredientIds: [number];
};
@Injectable()
export class ProductService {
  constructor(private prismaService: PrismaService) {}

  async create(body: ProductCreateInput): Promise<CreateProductDTO> {
    try {
      const { ingredientIds, ...data } = body;
      const productDB = await this.prismaService.product.create({ data });

      ingredientIds.forEach(async (item) => {
        try {
          await this.prismaService.productIngredient.create({
            data: { productId: productDB.id, ingredientId: item },
          });
        } catch (error) {
          throw new InternalServerErrorException(error);
        }
      });
      return { ...productDB, ingredientIds };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async find(): Promise<ProductDTO[]> {
    try {
      const productDB = await this.prismaService.product.findMany({
        include: {
          ingredients: {
            include: {
              ingredient: true,
            },
          },
        },
      });
      return productDB.map((product) => {
        const { ingredients, ...productDB } = product;
        return {
          ...productDB,
          ingredients: ingredients.map((ingredient) => ingredient.ingredient),
        };
      });
    } catch (error) {
      return error;
    }
  }
  async get(id: number): Promise<ProductDTO> {
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
      return error;
    }
  }
  async update(
    body: Prisma.ProductUpdateInput,
    id: number,
  ): Promise<ProductDTO> {
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
      return error;
    }
  }
  async delete(id: number): Promise<string> {
    try {
      const productDeleted = this.prismaService.product.delete({
        where: { id },
      });
      if (productDeleted) {
        return 'ok';
      }
    } catch (error) {}
  }
}
