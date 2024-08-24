import { Test, TestingModule } from '@nestjs/testing';
import EmployeeService from './service/employee.service';
import { PrismaService } from './service/prisma.service';
import { EmployeeDTO } from './dto/employee.dto';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
const fail = (message: string) => {
  throw new Error(message);
};
describe('EmployeeServicde', () => {
  let employeeService: EmployeeService;

  const mockEmployeeDB: EmployeeDTO[] = [
    {
      id: 1,
      name: 'John Doe',
      documentNumber: '123456789',
      email: 'john.doe@example.com',
      password: 'password',
      active: true,
      role: 'EMPLOYEE',
    },
    {
      id: 2,
      name: 'Jane Doe',
      documentNumber: '987654321',
      email: 'jane.doe@example.com',
      password: 'password',
      active: true,
      role: 'EMPLOYEE',
    },
  ];
  const mockPrismaService = {
    employee: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();
    employeeService = module.get<EmployeeService>(EmployeeService);
  });

  describe('createEmployee', () => {
    let inputEmployeeCreate: EmployeeDTO;
    beforeEach(() => {
      jest.clearAllMocks();
      inputEmployeeCreate = {
        name: 'John Doe',
        documentNumber: '123456789',
        email: 'john.doe@example.com',
        password: 'password',
        active: true,
        role: 'EMPLOYEE',
      };
    });

    it('should call prismaService.create', async () => {
      await employeeService.createEmployee(inputEmployeeCreate);
      expect(mockPrismaService.employee.create).toHaveBeenCalled();
      expect(mockPrismaService.employee.create).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.employee.create).toHaveBeenCalledWith({
        data: inputEmployeeCreate,
      });
    });

    it('should return intenal error message', async () => {
      const inputEmployeeCreate: EmployeeDTO = {
        name: null,
        documentNumber: null,
        email: null,
        password: null,
        active: true,
        role: null,
      };
      try {
        await employeeService.createEmployee(inputEmployeeCreate);
        fail('Expected error message');
      } catch (err) {
        expect(err.status).toBe(500);
        expect(err).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });
  describe('getEmployeeById', () => {
    beforeEach(() => {
      mockPrismaService.employee.findUnique.mockResolvedValue(
        mockEmployeeDB[0],
      );
    });
    it('should be defined', () => {
      expect(employeeService.getEmployeeById(1)).toBeDefined();
    });

    it('should call prismaService.findUnique', async () => {
      const result = await employeeService.getEmployeeById(1);
      expect(mockPrismaService.employee.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.employee.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockEmployeeDB[0]);
    });
    it('should return error message', async () => {
      mockPrismaService.employee.findUnique.mockResolvedValue(null);
      try {
        await employeeService.getEmployeeById(NaN);
        fail('Expected error message');
      } catch (err) {
        expect(err.status).toEqual(404);
        expect(err.message).toBe('Employee not found');
        expect(err).toBeInstanceOf(NotFoundException);
      }
    });
  });
  describe('findEmployee', () => {
    beforeEach(() => {
      mockPrismaService.employee.findMany.mockResolvedValue(mockEmployeeDB);
    });
    it('should be defined', () => {
      expect(employeeService.findEmployee()).toBeDefined();
    });

    it('should call prismaService.findMany', async () => {
      const result = await employeeService.findEmployee();
      expect(mockPrismaService.employee.findMany).toHaveBeenCalled();
      expect(mockPrismaService.employee.findMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockEmployeeDB);
    });
    it('should return internal error', async () => {
      mockPrismaService.employee.findMany.mockRejectedValue(
        new Error('Internal error'),
      );
      try {
        await employeeService.findEmployee();
        fail('Expected error message');
      } catch (err) {
        expect(err.status).toEqual(500);
        expect(err).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });
  describe('updateEmployee', () => {
    let inpuEmployeeUpdate: Partial<EmployeeDTO>;
    beforeEach(() => {
      mockPrismaService.employee.update.mockResolvedValue(mockEmployeeDB[0]);
      inpuEmployeeUpdate = {
        name: 'John Doe 2',
        documentNumber: '123456789',
        email: 'john.doe@example.com',
      };
    });

    it('should be defined', () => {
      expect(
        employeeService.updateEmployee(1, inpuEmployeeUpdate),
      ).toBeDefined();
    });
    it('should success call prismaService.update', async () => {
      await employeeService.updateEmployee(1, inpuEmployeeUpdate);
      expect(mockPrismaService.employee.update).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.employee.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: inpuEmployeeUpdate,
      });
    });
    it('should return error message', async () => {
      mockPrismaService.employee.update.mockRejectedValue(
        new Error('Internal Server Error'),
      );
      try {
        await employeeService.updateEmployee(1, mockEmployeeDB[0]);
        fail('Expected error message');
      } catch (err) {
        expect(err.status).toBe(500);
        expect(err).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });
  describe('deleteEmployee', () => {
    it('should be defined', () => {
      expect(employeeService.deleteEmployee(1)).toBeDefined();
    });
    it('should success call prismaService.delete ', async () => {
      const result = await employeeService.deleteEmployee(1);
      expect(mockPrismaService.employee.delete).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.employee.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toBe('ok');
    });
    it('should return error message', async () => {
      mockPrismaService.employee.delete.mockRejectedValue(
        new Error('Internal Server Error'),
      );
      try {
        await employeeService.deleteEmployee(1);
        fail('Expected error message');
      } catch (err) {
        expect(err).toBeInstanceOf(InternalServerErrorException);
        expect(err.status).toBe(500);
        expect(err.message).toBe('Internal Server Error');
      }
    });
  });
});
