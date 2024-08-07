import { Module } from '@nestjs/common';
import { AuthController } from 'src/controller/auth.controller';
import { AuthService } from 'src/service/auth.service';
import { PrismaService } from 'src/service/prisma.service';
import { RedisService } from 'src/service/redis.service';
import { TokenService } from 'src/service/token.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, TokenService, PrismaService, RedisService],
})
export class AuthModule {}
