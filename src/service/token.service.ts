import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { JwtService } from '@nestjs/jwt';
import { TokenDTO } from 'src/dto/token.dto';
import { IGenerateToken, ISaveToken } from 'src/interface/token.interface';
import { EmployeeTokenWhereUniqueInput } from 'prisma';
import { jwtDecode } from 'jwt-decode';
import { RedisService } from './redis.service';
import { IPayloadClientToken } from 'src/interface/clientToken.interface';

@Injectable()
export class TokenService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
  ) {}
  private async generateToken(payload: IGenerateToken): Promise<string> {
    const access_token = await this.jwtService.signAsync(payload);
    return access_token;
  }
  private generateExpireIn(): number {
    const date = new Date();
    date.setHours(date.getHours() - 3);
    const expireIn = Math.floor(date.getTime() / 1000 + 60);
    return expireIn;
  }
  async saveToken({
    employeeId,
    token,
  }: ISaveToken): Promise<Omit<TokenDTO, 'employeeId'>> {
    const where: EmployeeTokenWhereUniqueInput = {};
    if (!token && employeeId) {
      where['employeeId'] = employeeId;
    } else if (!employeeId && token) {
      where['access_token'] = token;
    } else {
      throw new BadRequestException('Invalid Params');
    }
    try {
      const tokenDB = await this.prismaService.employeeToken.findUnique({
        where: where,
        include: { employee: true },
      });
      if (!tokenDB) {
        const employeDB = await this.prismaService.employee.findUnique({
          where: { id: employeeId },
        });

        const payload: IGenerateToken = {
          sub: employeeId,
          name: employeDB.name,
          username: employeDB.email,
          role: employeDB.role,
        };

        const newToken = await this.generateToken(payload);

        const data: TokenDTO = {
          access_token: newToken,
          expireIn: this.generateExpireIn(),
          employeeId: employeeId,
        };

        const tokenCreateDB = await this.prismaService.employeeToken.create({
          data,
        });
        delete tokenCreateDB.id;
        delete tokenCreateDB.employeeId;
        return tokenCreateDB;
      } else if (tokenDB) {
        const payload: IGenerateToken = {
          sub: tokenDB.employeeId,
          name: tokenDB.employee.name,
          username: tokenDB.employee.email,
          role: tokenDB.employee.role,
        };

        const newToken = await this.generateToken(payload);
        const updatedToken = await this.prismaService.employeeToken.update({
          where: { employeeId: tokenDB.employeeId },
          data: {
            access_token: newToken,
          },
        });
        delete updatedToken.id;
        delete updatedToken.employeeId;
        return updatedToken;
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async generateTokenToClient(token: string): Promise<any> {
    if (!token) {
      throw new BadRequestException('Missing token');
    }
    const client: Omit<IPayloadClientToken, 'role'> = jwtDecode(token);

    if (!client) {
      throw new InternalServerErrorException();
    }

    if (!client.sub || !client.username || !client.name) {
      throw new UnauthorizedException('Invalid token');
    }

    const clientTokenCache = await this.redisService.get(`user:${client.sub}`);

    if (!clientTokenCache) {
      const payload: IGenerateToken = {
        sub: client.sub,
        name: client.name,
        username: client.username,
        role: 'USER',
      };
      const internalToken = await this.generateToken(payload);

      const clientToken = {
        userId: client.sub,
        access_token: internalToken,
        expireIn: this.generateExpireIn(),
      };

      await this.redisService.setex(
        `user:${client.sub}`,
        600,
        JSON.stringify(clientToken),
      );

      delete clientToken.userId;
      return clientToken;
    }
    const clientToken = JSON.parse(clientTokenCache);
    delete clientToken.userId;
    return clientToken;
  }
}
