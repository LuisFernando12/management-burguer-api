import { Module } from '@nestjs/common';
import EmployeeController from 'src/controller/employee.controller';
import EmployeeService from 'src/service/employee.service';
import { PrismaService } from 'src/service/prisma.service';

@Module({
  controllers: [EmployeeController],
  providers: [PrismaService, EmployeeService],
})
export class EmployeeModule {}
