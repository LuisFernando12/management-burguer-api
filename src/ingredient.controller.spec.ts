import { Test, TestingModule } from '@nestjs/testing';
import { IngredientController } from './controller/ingredient.controller';
import { IngredientService } from './service/ingredient.service';
import { IngredientDTO } from './dto/ingredient.dto';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';
const fail = (message: string) => {
  throw new Error(message);
};

describe('IngredientController', () => {
  let ingredientController: IngredientController;
  const mockIngredientService = {
    create: jest.fn(),
    find: jest.fn(),
    get: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngredientController],
      providers: [
        JwtService,
        {
          provide: IngredientService,
          useValue: mockIngredientService,
        },
      ],
    }).compile();
    ingredientController =
      module.get<IngredientController>(IngredientController);
  });

  describe('createIngredient', () => {
    let inputCreateIngredient: IngredientDTO;
    beforeEach(() => {
      inputCreateIngredient = {
        name: 'Test',
        type: 'VEGETABLE',
        unitMeasurement: 'kg',
      };
    });
    it('should be defined', () => {
      expect(
        ingredientController.createIngredient(inputCreateIngredient),
      ).toBeDefined();
    });
    it('should success call ingredientService.create', async () => {
      jest.clearAllMocks();
      await ingredientController.createIngredient(inputCreateIngredient);
      expect(mockIngredientService.create).toHaveBeenCalledTimes(1);
      expect(mockIngredientService.create).toHaveBeenCalledWith(
        inputCreateIngredient,
      );
    });
  });
  describe('findAllingredients', () => {
    it('should be defined', () => {
      expect(ingredientController.findAllIngredient()).toBeDefined();
    });
    it('should success call ingredientService.find', async () => {
      jest.clearAllMocks();
      await ingredientController.findAllIngredient();
      expect(mockIngredientService.find).toHaveBeenCalledTimes(1);
    });
  });
  describe('getIngredientById', () => {
    it('should be defined', () => {
      expect(ingredientController.getIngredientById(1)).toBeDefined();
    });
    it('should success call ingredientService.get', async () => {
      jest.clearAllMocks();
      await ingredientController.getIngredientById(1);
      expect(mockIngredientService.get).toHaveBeenCalledTimes(1);
      expect(mockIngredientService.get).toHaveBeenCalledWith(1);
    });
    it('should return error message', async () => {
      try {
        await ingredientController.getIngredientById(NaN);
        fail('Expected error message');
      } catch (err) {
        expect(err.message).toBe('missing ID');
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.status).toBe(400);
      }
    });
  });
  describe('updateIngredient', () => {
    let inputUpdateIngredient: IngredientDTO;
    beforeEach(() => {
      inputUpdateIngredient = {
        name: 'Updated Test',
        type: 'VEGETABLE',
        unitMeasurement: 'kg',
      };
    });
    it('should be defined', () => {
      expect(
        ingredientController.updateIngredient(1, inputUpdateIngredient),
      ).toBeDefined();
    });
    it('should success call ingredientService.update', async () => {
      jest.clearAllMocks();
      await ingredientController.updateIngredient(1, inputUpdateIngredient);
      expect(mockIngredientService.update).toHaveBeenCalledTimes(1);
      expect(mockIngredientService.update).toHaveBeenCalledWith(
        inputUpdateIngredient,
        1,
      );
    });
    it('should return error message', async () => {
      try {
        await ingredientController.updateIngredient(NaN, inputUpdateIngredient);
        fail('Expected error message');
      } catch (err) {
        expect(err.message).toBe('Invalid params');
      }
    });
  });
});
