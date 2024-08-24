import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { EmployeeDTO } from '../dto/employee.dto';
import EmployeeService from '../service/employee.service';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
@Controller('/employee')
@ApiTags('Employee')
export default class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post('/')
  @ApiCreatedResponse({ type: EmployeeDTO })
  async createEmployee(@Body() employee: EmployeeDTO): Promise<EmployeeDTO> {
    return await this.employeeService.createEmployee(employee);
  }

  @Get('/:id')
  @ApiCreatedResponse({ type: EmployeeDTO })
  async getEmployeeById(@Param('id') id: number): Promise<EmployeeDTO> {
    if (!id || isNaN(Number(id))) {
      throw new BadRequestException('missing id');
    }

    return await this.employeeService.getEmployeeById(Number(id));
  }
  @Get()
  @ApiCreatedResponse({ type: [EmployeeDTO] })
  async findAllEmployees(): Promise<EmployeeDTO[]> {
    return await this.employeeService.findEmployee();
  }
  @Put('/:id')
  @ApiCreatedResponse({ type: EmployeeDTO })
  async updateEmployee(
    @Param('id') id: number,
    @Body() employee: Partial<EmployeeDTO>,
  ): Promise<EmployeeDTO> {
    if (!id || isNaN(Number(id))) {
      throw new BadRequestException('missing id');
    }
    return await this.employeeService.updateEmployee(Number(id), employee);
  }
  @Delete('/:id')
  async deleteEmployee(@Param('id') id: number): Promise<string> {
    if (!id || isNaN(Number(id))) {
      throw new BadRequestException('missing id');
    }

    return await this.employeeService.deleteEmployee(Number(id));
  }
}
