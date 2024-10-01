import { Test, TestingModule } from '@nestjs/testing';
import { IngredientService } from './service/ingredient.service';
import { PrismaService } from './service/prisma.service';
import { IngredientDTO } from './dto/ingredient.dto';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
const fail = (message: string) => {
  throw new Error(message);
};

describe('IngredientService', () => {
  let ingredientService: IngredientService;
  const mockPrismaService = {
    ingredient: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
  const mockIngredientDB: IngredientDTO[] = [
    {
      id: 1,
      name: 'Test',
      type: 'VEGETABLE',
      unitMeasurement: 'kg',
    },
    {
      name: 'Test 2',
      type: 'MEAT',
      unitMeasurement: 'g',
    },
  ];
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngredientService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();
    ingredientService = module.get<IngredientService>(IngredientService);
  });
  describe('create', () => {
    let inputCreateIngredient: IngredientDTO;
    beforeEach(() => {
      inputCreateIngredient = {
        name: 'Test',
        type: 'VEGETABLE',
        unitMeasurement: 'kg',
      };
    });
    it('should be defined', () => {
      expect(ingredientService.create).toBeDefined();
    });
    it('should call prismaServie.ingredient.create and return ingredient created', async () => {
      mockPrismaService.ingredient.create.mockReturnValue(mockIngredientDB[0]);
      const result = await ingredientService.create(inputCreateIngredient);
      expect(mockPrismaService.ingredient.create).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.ingredient.create).toHaveBeenCalledWith({
        data: inputCreateIngredient,
      });
      expect(result).toHaveProperty('name', 'Test');
    });
    it('should return error message', async () => {
      mockPrismaService.ingredient.create.mockRejectedValue(
        new Error('Internal Server Error'),
      );
      try {
        await ingredientService.create(null);
        fail('Expected error message');
      } catch (err) {
        expect(err).toBeInstanceOf(InternalServerErrorException);
        expect(err.status).toBe(500);
        expect(err.message).toBe('Internal Server Error');
      }
    });
  });
  describe('find', () => {
    beforeEach(() => {
      mockPrismaService.ingredient.findMany.mockResolvedValue(mockIngredientDB);
    });
    it('should be defined', () => {
      expect(ingredientService.find).toBeDefined();
    });
    it('should success call prismaService.findMany and return ingredients', async () => {
      const result = await ingredientService.find();
      expect(mockPrismaService.ingredient.findMany).toHaveBeenCalledTimes(1);
      expect(result).toBe(mockIngredientDB);
    });
  });
  describe('get', () => {
    beforeEach(() => {
      mockPrismaService.ingredient.findUnique.mockResolvedValue(
        mockIngredientDB[0],
      );
    });
    it('should be defined', () => {
      expect(ingredientService.get).toBeDefined();
    });

    it('should success call prismaService.findUnique and return one ingredient', async () => {
      const result = await ingredientService.get(1);
      expect(mockPrismaService.ingredient.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.ingredient.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockIngredientDB[0]);
    });

    it('should return error message', async () => {
      mockPrismaService.ingredient.findUnique.mockResolvedValue(null);
      try {
        await ingredientService.get(1);
        fail('Expected error message');
      } catch (err) {
        expect(err.message).toBe('Ingredient not found');
        expect(err.status).not.toBe(200);
        expect(err).toBeInstanceOf(NotFoundException);
      }
    });
  });
  describe('update', () => {
    let inputUpadateIngredient: Partial<IngredientDTO>;
    beforeEach(() => {
      inputUpadateIngredient = {
        name: 'Updated Test',
      };
      mockPrismaService.ingredient.update.mockResolvedValue(
        mockIngredientDB[0],
      );
    });

    it('should be defined', () => {
      expect(ingredientService.update).toBeDefined();
    });

    it('should success call prismaService.update', async () => {
      const result = await ingredientService.update(inputUpadateIngredient, 1);
      expect(mockPrismaService.ingredient.update).toHaveBeenCalled();
      expect(mockPrismaService.ingredient.update).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.ingredient.update).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
        data: inputUpadateIngredient,
      });
      expect(result).toEqual(mockIngredientDB[0]);
    });
    it('should fail call prismaService.update', async () => {
      mockPrismaService.ingredient.update.mockRejectedValue(
        new Error(' Internal Server Error'),
      );
      try {
        await ingredientService.update(null, 1);
        fail('Expected error message');
      } catch (err) {
        expect(err.status).toBe(500);
      }
    });
  });
  describe('delete', () => {
    beforeEach(() => {
      mockPrismaService.ingredient.delete.mockResolvedValue('OK');
    });

    it('should be defined', () => {
      expect(ingredientService.delete).toBeDefined();
    });

    it('should call prismaService.delete', async () => {
      const result = await ingredientService.delete(1);
      expect(mockPrismaService.ingredient.delete).toHaveBeenCalled();
      expect(mockPrismaService.ingredient.delete).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.ingredient.delete).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
      });
      expect(result).toBe('OK');
    });
    it('should fail call prismaService.delete', async () => {
      mockPrismaService.ingredient.delete.mockRejectedValue(
        new Error('Interna Server Error'),
      );

      try {
        await ingredientService.delete(1);
      } catch (err) {
        expect(err.status).toBe(500);
        expect(err).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });
});
