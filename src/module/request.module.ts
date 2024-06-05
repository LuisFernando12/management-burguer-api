import { Module } from '@nestjs/common';
import { RequestController } from 'src/controller/request.controller';
import { PrismaService } from 'src/service/prisma.service';
import { RequestService } from 'src/service/request.service';

@Module({
  controllers: [RequestController],
  providers: [PrismaService, RequestService],
})
export class ResquestModule {}
