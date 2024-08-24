import { Test, TestingModule } from '@nestjs/testing';
import EmployeeController from './controller/employee.controller';
import EmployeeService from './service/employee.service';
import { BadRequestException } from '@nestjs/common';

const fail = (message: string) => {
  throw new Error(message);
};
describe('EmployeeController', () => {
  let employeeController: EmployeeController;
  const mockEmployeeService = {
    createEmployee: jest.fn(),
    getEmployeeById: jest.fn(),
    findEmployee: jest.fn(),
    updateEmployee: jest.fn(),
    deleteEmployee: jest.fn(),
  };
  beforeEach(async () => {
    jest.clearAllMocks(); // Clear all mocks before each test run
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeController],
      providers: [
        {
          provide: EmployeeService,
          useValue: mockEmployeeService,
        },
      ],
    }).compile();
    employeeController = module.get<EmployeeController>(EmployeeController);
  });
  describe('createEmployee', () => {
    let inputCreateEmployee;
    beforeEach(() => {
      inputCreateEmployee = {
        name: 'John Doe',
        documentNumber: '123456789',
        email: 'john.doe@example.com',
        password: 'password',
        active: true,
        role: 'EMPLOYEE',
      };
    });
    it('should be defined', () => {
      expect(employeeController.createEmployee).toBeDefined();
    });
    it('should call employeeController.createEmployee', async () => {
      await employeeController.createEmployee(inputCreateEmployee);
      expect(mockEmployeeService.createEmployee).toHaveBeenCalledTimes(1);
      expect(mockEmployeeService.createEmployee).toHaveBeenCalledWith(
        inputCreateEmployee,
      );
    });
  });
  describe('getEmployeeById', () => {
    it('should be defined', () => {
      expect(employeeController.getEmployeeById).toBeDefined();
    });
    it('should call employeeController.getEmployeeById', async () => {
      await employeeController.getEmployeeById(1);
      expect(mockEmployeeService.getEmployeeById).toHaveBeenCalledTimes(1);
      expect(mockEmployeeService.getEmployeeById).toHaveBeenLastCalledWith(1);
    });
    it('should return error message', async () => {
      try {
        await employeeController.getEmployeeById(NaN);
        fail('Expected error message');
      } catch (err) {
        expect(err.message).toBe('missing id');
        expect(err).toBeInstanceOf(BadRequestException);
      }
    });
  });
  describe('findAllEmployees', () => {
    it('shuld be defined', () => {
      expect(employeeController.findAllEmployees).toBeDefined();
    });
    it('shoul call employeeController.findAllEmployees', async () => {
      await employeeController.findAllEmployees();
      expect(mockEmployeeService.findEmployee).toHaveBeenCalledTimes(1);
      expect(mockEmployeeService.findEmployee).toHaveLength(0);
    });
  });
  describe('updateEmployee', () => {
    let inputUpdateEmployee;
    beforeEach(() => {
      inputUpdateEmployee = {
        name: 'John Doe 2',
        documentNumber: '123456789',
        email: 'john.doe@example.com',
      };
    });
    it('should be defined', () => {
      expect(employeeController.updateEmployee).toBeDefined();
    });
    it('should call employeeController.updateEmployee', async () => {
      await employeeController.updateEmployee(1, inputUpdateEmployee);
      expect(mockEmployeeService.updateEmployee).toHaveBeenCalledTimes(1);
      expect(mockEmployeeService.updateEmployee).toHaveBeenCalledWith(
        1,
        inputUpdateEmployee,
      );
    });
    it('should return error message', async () => {
      try {
        await employeeController.updateEmployee(NaN, inputUpdateEmployee);
        fail('Expected error message');
      } catch (err) {
        expect(err.status).toEqual(400);
        expect(err.message).toBe('missing id');
        expect(err).toBeInstanceOf(BadRequestException);
      }
    });
  });
  describe('deleteEmployee', () => {
    it('should be defined', () => {
      expect(employeeController.deleteEmployee).toBeDefined();
    });
    it('should call employeeController.deleEmployee', async () => {
      await employeeController.deleteEmployee(1);
      expect(mockEmployeeService.deleteEmployee).toHaveBeenCalledTimes(1);
      expect(mockEmployeeService.deleteEmployee).toHaveBeenCalledWith(1);
    });
    it('should return error message', async () => {
      try {
        await employeeController.deleteEmployee(NaN);
        fail('Expected error message');
      } catch (err) {
        expect(err.status).toEqual(400);
        expect(err.message).toBe('missing id');
        expect(err).toBeInstanceOf(BadRequestException);
      }
    });
  });
});
