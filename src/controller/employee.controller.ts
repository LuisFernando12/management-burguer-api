import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Employee } from 'src/dto/employee.dto';
import EmployeeService from 'src/service/employee.service';
import * as bcrypt from 'bcrypt';
@Controller('/employee')
export default class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  private async encryptPassword(password: string): Promise<string> {
    const salt: number = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
  @Post('/')
  async createmployee(@Body() employee: Employee): Promise<Employee> {
    if (!employee) {
      throw new BadRequestException();
    }
    try {
      employee.password = await this.encryptPassword(employee.password);
      return await this.employeeService.createEmployee(employee);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  //   @Get('/')
  //   async getEmployeeByEmail(email: string): Promise<Employee | null> {
  //     if (!email) {
  //       throw new BadRequestException();
  //     }
  //     try {
  //       const employeeDB = await this.employeeService.getEmployeeByEmail(email);
  //       if (!employeeDB) {
  //         throw new NotFoundException('Emplooyee not found');
  //       }
  //       return employeeDB;
  //     } catch (e) {
  //       throw new InternalServerErrorException(e);
  //     }
  //   }

  @Get('/:id')
  async getEmployeeById(@Param('id') id: number): Promise<Employee | null> {
    if (!id) {
      throw new BadRequestException();
    }
    try {
      const employeeDB = await this.employeeService.getEmployeeById(id);
      if (!employeeDB) {
        throw new NotFoundException('Employee not found');
      }
      return employeeDB;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
  @Get()
  async findAllEmployees(): Promise<Employee[]> {
    try {
      return await this.employeeService.findEmployee();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
  @Put('/:id')
  async updateEmployee(
    @Param('id') id: number,
    @Body() employee: Employee,
  ): Promise<Employee> {
    if (!employee || !id) {
      throw new BadRequestException();
    }
    try {
      const updatedEmployee = await this.employeeService.updateEmployee(
        id,
        employee,
      );
      if (!updatedEmployee) {
        throw new NotFoundException('Employee not found');
      }
      return updatedEmployee;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
  @Delete('/:id')
  async deleteEmployee(@Param('id') id: number): Promise<string> {
    if (!id) {
      throw new BadRequestException();
    }
    try {
      return await this.employeeService.deleteEmployee(id);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
