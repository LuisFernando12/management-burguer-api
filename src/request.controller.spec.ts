import { Test, TestingModule } from '@nestjs/testing';
import { RequestController } from './controller/request.controller';
import { RequestService } from './service/request.service';
import { JwtService } from '@nestjs/jwt';

describe('RequestController', () => {
  const mockRequestService = {
    create: jest.fn(),
    find: jest.fn(),
    findByClient: jest.fn(),
    get: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  let requestController: RequestController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestController],
      providers: [
        {
          provide: RequestService,
          useValue: mockRequestService,
        },
        JwtService,
      ],
    }).compile();
    requestController = module.get<RequestController>(RequestController);
  });

  describe('create', () => {
    it('should be defined', () => {
      expect(requestController.create).toBeDefined();
    });
  });
});
