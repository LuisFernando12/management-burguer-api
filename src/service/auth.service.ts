import { PrismaService } from './prisma.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenService } from './token.service';
import * as bcrypt from 'bcrypt';
import { TokenDTO } from 'src/dto/token.dto';
import { LoginDTO } from 'src/dto/auth.dto';
import { RefreshTokenDTO } from 'src/dto/refreshToken.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly tokenService: TokenService,
  ) {}
  private async comparePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
  async login({
    documentNumber,
    password,
  }: LoginDTO): Promise<Omit<TokenDTO, 'employeeId'>> {
    const employee = await this.prismaService.employee.findFirst({
      where: { documentNumber },
    });
    const hash = employee.password;
    if (!employee || !(await this.comparePassword(password, hash))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { employeeId: employee.id };
    const access_token = await this.tokenService.saveToken(payload);
    return access_token;
  }
  async refreashToken({
    oldToken,
  }: RefreshTokenDTO): Promise<Omit<TokenDTO, 'employeeId'>> {
    return await this.tokenService.saveToken({ token: oldToken });
  }

  async clientToken(token: string) {
    return await this.tokenService.generateTokenToClient(token);
  }
}
