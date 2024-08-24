import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { EmployeeDTO } from 'src/dto/employee.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export default class EmployeeService {
  constructor(private prismaService: PrismaService) {}
  private async encryptPassword(password: string): Promise<string> {
    const salt: number = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
  async createEmployee(employee: EmployeeDTO): Promise<EmployeeDTO> {
    try {
      employee.password = await this.encryptPassword(employee.password);
      return await this.prismaService.employee.create({
        data: employee,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async getEmployeeById(id: number): Promise<EmployeeDTO | null> {
    const employeeDB = await this.prismaService.employee.findUnique({
      where: { id },
    });
    if (!employeeDB) {
      throw new NotFoundException('Employee not found');
    }
    return employeeDB;
  }
  async findEmployee(): Promise<EmployeeDTO[]> {
    try {
      return await this.prismaService.employee.findMany();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async updateEmployee(
    id: number,
    employee: Partial<EmployeeDTO>,
  ): Promise<EmployeeDTO> {
    try {
      const updatedEmployeeDB = await this.prismaService.employee.update({
        where: { id },
        data: employee,
      });
      return updatedEmployeeDB;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async deleteEmployee(id: number): Promise<string> {
    try {
      await this.prismaService.employee.delete({ where: { id } });
      return 'ok';
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
