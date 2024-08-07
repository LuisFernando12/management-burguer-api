import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { EmployeeDTO } from 'src/dto/employee.dto';

@Injectable()
export default class EmployeeService {
  constructor(private prismaService: PrismaService) {}

  async createEmployee(employee: EmployeeDTO): Promise<EmployeeDTO> {
    return await this.prismaService.employee.create({
      data: employee,
    });
  }
  async getEmployeeByEmail(email: string): Promise<EmployeeDTO | null> {
    return await this.prismaService.employee.findFirst({ where: { email } });
  }
  async getEmployeeById(id: number): Promise<EmployeeDTO | null> {
    return await this.prismaService.employee.findUnique({ where: { id } });
  }
  async findEmployee(): Promise<EmployeeDTO[]> {
    return await this.prismaService.employee.findMany();
  }
  async updateEmployee(
    id: number,
    employee: EmployeeDTO,
  ): Promise<EmployeeDTO> {
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
