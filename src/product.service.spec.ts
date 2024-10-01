import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './service/product.service';
import { PrismaService } from './service/prisma.service';
import { RedisService } from './service/redis.service';
import { ProductDTO, ResponseProductDTO } from './dto/product.dto';
import { InternalServerErrorException } from '@nestjs/common';

const fail = (message: string) => {
  throw new Error(message);
};

describe('ProducService', () => {
  let productService: ProductService;
  const mockPrismaService = {
    product: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    productIngredient: {
      create: jest.fn(),
    },
  };
  const mockRedisService = {
    setex: jest.fn(),
    get: jest.fn(),
  };
  const mockProductDB: ResponseProductDTO[] = [
    {
      name: 'Test',
      description: 'Test Product',
      price: 10,
      amount: 10,
      suplier: 'Test Suplier',
      category: 'FOOD',
      ingredients: [
        {
          id: 1,
          name: 'Ingredient 1',
          type: 'VEGETABLE',
          unitMeasurement: 'kg',
        },
        {
          id: 2,
          name: 'Ingredient 2',
          type: 'FRUIT',
          unitMeasurement: 'kg',
        },
        {
          id: 3,
          name: 'Ingredient 3',
          type: 'MEAT',
          unitMeasurement: 'kg',
        },
      ],
    },
    {
      name: 'Test2',
      description: 'Test Product2',
      price: 10,
      amount: 10,
      suplier: 'Test Suplier',
      category: 'FOOD',
      ingredients: [
        {
          id: 1,
          name: 'Ingredient 1',
          type: 'VEGETABLE',
          unitMeasurement: 'kg',
        },
        {
          id: 2,
          name: 'Ingredient 2',
          type: 'FRUIT',
          unitMeasurement: 'kg',
        },
        {
          id: 3,
          name: 'Ingredient 3',
          type: 'MEAT',
          unitMeasurement: 'kg',
        },
      ],
    },
  ];
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
      ],
    }).compile();
    productService = module.get<ProductService>(ProductService);
  });
  describe('create', () => {
    let inputCreateProduct: ProductDTO;
    beforeEach(() => {
      inputCreateProduct = {
        name: 'Test',
        description: 'Test Product',
        price: 10,
        amount: 10,
        suplier: 'Test Suplier',
        category: 'FOOD',
        ingredientIds: [1, 2, 3],
      };
    });
    it('should be defined', () => {
      expect(productService.create).toBeDefined();
    });
    it('should succeed call prismaService.product.create and prismaService.productIngredient.create', async () => {
      const { ingredientIds, ...productWithoutIngredientIds } =
        inputCreateProduct;
      mockPrismaService.product.create.mockResolvedValue(
        productWithoutIngredientIds,
      );
      const result = await productService.create(inputCreateProduct);
      expect(mockPrismaService.product.create).toHaveBeenCalled();
      expect(mockPrismaService.product.create).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.product.create).toHaveBeenCalledWith({
        data: productWithoutIngredientIds,
      });

      ingredientIds.forEach(async (ingredientId) => {
        expect(mockPrismaService.productIngredient.create).toHaveBeenCalledWith(
          {
            data: { productId: result.id, ingredientId: ingredientId },
          },
        );
      });
    });
    it('should fail call prismaService.product.create', async () => {
      mockPrismaService.product.create.mockRejectedValue(new Error());
      try {
        await productService.create(inputCreateProduct);
        fail('Expected error');
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.status).toBe(500);
      }
    });
  });
  describe('find', () => {
    it('should be defined', () => {
      expect(productService.find).toBeDefined();
    });
    it('should succedd call pisma.product.findMany', async () => {
      mockPrismaService.product.findMany.mockResolvedValue(mockProductDB);
      await productService.find();
      expect(mockPrismaService.product.findMany).toHaveBeenCalled();
      expect(mockPrismaService.product.findMany).toHaveBeenCalledTimes(1);
    });
    it('should call redisService.get and return products', async () => {
      jest.clearAllMocks();
      mockRedisService.get.mockResolvedValue(JSON.stringify(mockProductDB));
      await productService.find();
      expect(mockRedisService.get).toHaveBeenCalled();
      expect(mockRedisService.get).toHaveBeenCalledTimes(1);
    });
    it('should return error', async () => {
      jest.clearAllMocks();
      mockRedisService.get.mockRejectedValue(new Error());
      try {
        await productService.find();
        fail('Expected error');
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.status).toBe(500);
      }
    });
  });
  describe('get', () => {
    it('should be defined', () => {
      expect(productService.get).toBeDefined();
    });
    it('should succeed call prismaService.product.findUnique', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(mockProductDB[0]);
      await productService.get(1);
      expect(mockPrismaService.product.findUnique).toHaveBeenCalled();
      expect(mockPrismaService.product.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          ingredients: {
            include: {
              ingredient: true,
            },
          },
        },
      });
    });
    it('should fail call prismaService.product.findUnique', async () => {
      mockPrismaService.product.findUnique.mockRejectedValue(new Error());
      try {
        await productService.get(1);
        fail('Expected error');
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.status).toBe(500);
      }
    });
  });
  describe('update', () => {
    let inputUpdateProduct: Partial<ProductDTO>;
    beforeEach(() => {
      inputUpdateProduct = {
        name: 'Updated Test',
        description: 'Updated Test Product',
        price: 15,
        amount: 5,
        suplier: 'Updated Test Suplier',
        category: 'FOOD',
        ingredientIds: [4, 5, 6],
      };
    });
    it('should be defined', () => {
      expect(productService.update).toBeDefined();
    });
    it('should succeed call prismaService.update', async () => {
      mockPrismaService.product.update.mockResolvedValue(mockProductDB[0]);
      await productService.update(inputUpdateProduct, 1);
      expect(mockPrismaService.product.update).toHaveBeenCalled();
      expect(mockPrismaService.product.update).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.product.update).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
        data: inputUpdateProduct,
        include: {
          ingredients: {
            include: {
              ingredient: true,
            },
          },
        },
      });
    });
    it('should fail call prismaService.product.update', async () => {
      mockPrismaService.product.update.mockRejectedValue(new Error());
      try {
        await productService.update(inputUpdateProduct, NaN);
        fail('Expected error');
      } catch (err) {
        expect(err.status).toBe(500);
        expect(err).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });
  describe('delete', () => {
    it('should be defined', () => {
      expect(productService.delete).toBeDefined();
    });
    it('should succeed call prismaService.product.', async () => {
      mockPrismaService.product.delete.mockResolvedValue('ok');
      await productService.delete(1);
      expect(mockPrismaService.product.delete).toHaveBeenCalled();
      expect(mockPrismaService.product.delete).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.product.delete).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
      });
    });
    it('should fail call prismaService.product.', async () => {
      mockPrismaService.product.delete.mockRejectedValue(new Error());
      try {
        await productService.delete(NaN);
        fail('Expected error');
      } catch (err) {
        expect(err.status).toBe(500);
        expect(err).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });
});
