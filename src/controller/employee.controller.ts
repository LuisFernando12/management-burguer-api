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
import { EmployeeDTO } from 'src/dto/employee.dto';
import EmployeeService from 'src/service/employee.service';
import * as bcrypt from 'bcrypt';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
@Controller('/employee')
@ApiTags('Employee')
export default class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  private async encryptPassword(password: string): Promise<string> {
    const salt: number = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
  @Post('/')
  @ApiCreatedResponse({ type: EmployeeDTO })
  async createmployee(@Body() employee: EmployeeDTO): Promise<EmployeeDTO> {
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
  @ApiCreatedResponse({ type: EmployeeDTO })
  async getEmployeeById(@Param('id') id: number): Promise<EmployeeDTO> {
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
  @ApiCreatedResponse({ type: [EmployeeDTO] })
  async findAllEmployees(): Promise<EmployeeDTO[]> {
    try {
      return await this.employeeService.findEmployee();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
  @Put('/:id')
  @ApiCreatedResponse({ type: EmployeeDTO })
  async updateEmployee(
    @Param('id') id: number,
    @Body() employee: EmployeeDTO,
  ): Promise<EmployeeDTO> {
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
