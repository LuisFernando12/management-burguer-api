import { Test, TestingModule } from '@nestjs/testing';
import { IngredientService } from './service/ingredient.service';
import { PrismaService } from './service/prisma.service';
import { IngredientDTO } from './dto/ingredient.dto';
import { InternalServerErrorException } from '@nestjs/common';
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
});
