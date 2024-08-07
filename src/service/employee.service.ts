import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Employee } from 'src/dto/employee.dto';

@Injectable()
export default class EmployeeService {
  constructor(private prismaService: PrismaService) {}

  async createEmployee(employee: Employee): Promise<Employee> {
    return await this.prismaService.employee.create({
      data: employee,
    });
  }
  async getEmployeeByEmail(email: string): Promise<Employee | null> {
    return await this.prismaService.employee.findFirst({ where: { email } });
  }
  async getEmployeeById(id: number): Promise<Employee | null> {
    return await this.prismaService.employee.findUnique({ where: { id } });
  }
  async findEmployee(): Promise<Employee[]> {
    return await this.prismaService.employee.findMany();
  }
  async updateEmployee(id: number, employee: Employee): Promise<Employee> {
    return await this.prismaService.employee.update({
      where: { id },
      data: employee,
    });
  }
  async deleteEmployee(id: number): Promise<string> {
    await this.prismaService.employee.delete({ where: { id } });
    return 'ok';
  }
}
