import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './controller/product.controller';
import { ProductService } from './service/product.service';
import { ProductDTO } from './dto/product.dto';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';

const fail = (message: string) => {
  throw new Error(message);
};
describe('ProductController', () => {
  let productController: ProductController;
  const mockProductService = {
    create: jest.fn(),
    find: jest.fn(),
    get: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        JwtService,
      ],
    }).compile();
    productController = module.get<ProductController>(ProductController);
  });

  describe('create', () => {
    it('should be defined', () => {
      expect(productController.create).toBeDefined();
    });

    it('should call productService.create', async () => {
      const product: ProductDTO = {
        name: 'Test Product',
        description: 'Test Product Description',
        price: 10.0,
        amount: 100,
        suplier: 'Test Supplier',
        category: 'FOOD',
        ingredientIds: [1, 2, 3],
      };
      await productController.create(product);
      expect(mockProductService.create).toHaveBeenCalled();
      expect(mockProductService.create).toHaveBeenCalledTimes(1);
      expect(mockProductService.create).toHaveBeenCalledWith(product);
    });
  });
  describe('findAll', () => {
    it('shold be defined', () => {
      expect(productController.findAll).toBeDefined();
    });

    it('should succeed call productService.find', async () => {
      await productController.findAll();
      expect(mockProductService.find).toHaveBeenCalled();
      expect(mockProductService.find).toHaveBeenCalledTimes(1);
    });
  });
  describe('findOne', () => {
    it('should be defined', () => {
      expect(productController.findOne).toBeDefined();
    });

    it('should succeed call productService.get', async () => {
      await productController.findOne(1);
      expect(mockProductService.get).toHaveBeenCalled();
      expect(mockProductService.get).toHaveBeenCalledTimes(1);
      expect(mockProductService.get).toHaveBeenCalledWith(1);
    });

    it('should fail call productService.get', async () => {
      try {
        await productController.findOne(NaN);
        fail('Expected error message');
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.status).toBe(400);
      }
    });
  });
  describe('update', () => {
    it('should be defined', () => {
      expect(productController.update).toBeDefined();
    });
    it('should succeed call productService.update', async () => {
      const product: Partial<ProductDTO> = {
        name: 'Updated Test Product',
        description: 'Updated Test Product Description',
        price: 15.0,
        amount: 50,
        suplier: 'Updated Test Supplier',
        category: 'FOOD',
        ingredientIds: [4, 5, 6],
      };
      await productController.update(product, 1);
      expect(mockProductService.update).toHaveBeenCalled();
      expect(mockProductService.update).toHaveBeenCalledTimes(1);
      expect(mockProductService.update).toHaveBeenCalledWith(product, 1);
    });
    it('should fail call productService.update', async () => {
      try {
        await productController.update({}, NaN);
        fail('Expected error message');
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.status).toBe(400);
      }
    });
  });

  describe('delete', () => {
    it('should be defined', () => {
      expect(productController.delete).toBeDefined();
    });
    it('should succeed call productService.delete', async () => {
      await productController.delete(1);
      expect(mockProductService.delete).toHaveBeenCalled();
      expect(mockProductService.delete).toHaveBeenCalledTimes(1);
      expect(mockProductService.delete).toHaveBeenCalledWith(1);
    });
    it('should fail call productService.delete', async () => {
      try {
        await productController.delete(NaN);
        fail('Expected error message');
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.status).toBe(400);
      }
    });
  });
});
